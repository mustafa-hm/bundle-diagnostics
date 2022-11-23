import { recharge, getSubscriptions } from '../recharge.js'
import { groupBundles } from '../utils.js'

const { BUNDLE_COLLECTION_ID } = process.env

const selectionItem = (sub) => {
  return {
    collection_id: BUNDLE_COLLECTION_ID,
    collection_source: 'shopify',
    external_product_id: sub.external_product_id.ecommerce,
    external_variant_id: sub.external_variant_id.ecommerce,
    quantity: sub.quantity
  }
}

const getBundleSelections = async (id) => {
  const { data } = await recharge.get('/bundle_selections', { params: { purchase_item_ids: id }})
  return data?.bundle_selections
}

const deleteSubscription = async (id) => {
  const { data } = await recharge.delete(`/subscriptions/${id}`)
  return data?.subscription
}

const migrateBundle = async (bundle) => {
  const { id } = bundle.parent
  const selections = await getBundleSelections(id)
  if (selections?.length) {
    console.log('>> subscription', id, 'already migrated.')
    return selections[0]
  } else {
    console.log('>> migrating subscription', id)
    const items = bundle.children.map(i => selectionItem(i))
    const { data } = await recharge.post('/bundle_selections', {
      purchase_item_id: id,
      items
    })
    console.log('>> migrated subscription', id)
    return data?.bundle_selection
  }
}

export default async function (customerId) {
  const subs = await getSubscriptions(customerId)
  const { bundles, unbundled } = groupBundles(subs)
  if (!bundles.length) {
    console.log('>> no bundles, moving on..')
    return
  }
  for (const bundle of bundles) {
    const selection = await migrateBundle(bundle)
    if (selection.items_count !== bundle.size) {
      const message = `>> ERROR: INVALID BUNDLE MIGRATION subscription: ${bundle.parent.id} <<`
      throw new Error(message)
    }
    if (bundle.children.length) {
      console.log('>> cleaning up child subscriptions')
      for (const child of bundle.children) {
        await deleteSubscription(child.id)
        console.log('  > deleted', child.id)
      }
    }
  }
  console.log('> migration complete', customerId)
}
