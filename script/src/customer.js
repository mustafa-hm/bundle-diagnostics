import { AssertionError } from 'assert'
import recharge from './recharge.js'
import { assert, getProp, groupBundles } from './utils.js'
import { createIssue } from './issues.js'

export async function getSubscriptions (customerId) {
  const { data } = await recharge.get(`/subscriptions?customer_id=${customerId}&limit=250&page=1&status=active`)
  return data.subscriptions
}

const assertAndTrack = async (expected, actual, attributes) => {
  const { customer_id, bundle_id } = attributes
  try {
    assert(expected, actual, attributes.message)
  } catch (e) {
    if (e instanceof AssertionError) {
      const { message, expected, actual } = e
      console.log('------------')
      console.log('>> Customer Verification Failed <<')
      console.log('    customerId:', customer_id)
      console.log('    message:', message)
      console.log('    expected:', expected, 'actual:', actual)
      console.log('------------')
      await createIssue({
        customer_id,
        bundle_id,
        data: {
          message,
          expected,
          actual
        }
      })
    } else {
      throw e
    }
  }
}

export async function verifyCustomer (customerId) {
  const subs = await getSubscriptions(customerId)
  const attributes = {
    customer_id: customerId
  }
  const { bundles, unbundled } = groupBundles(subs)
  console.log('> Verifying customer', customerId, 'bundles', bundles.length, 'unbundled', unbundled.length)
  await assertAndTrack(0, unbundled.filter(i => getProp('__bundle_id')).length, { ...attributes, message: 'Orphaned Subs' })
  for (const bundle of bundles) {
    const { id, parent, children, size, totalQuantity } = bundle
    attributes.bundle_id = id
    await assertAndTrack(size, totalQuantity, { ...attributes, message: 'Bundle Size' })
    for (const child of children) {
      await assertAndTrack(parent.address_id, child.address_id, { ...attributes, message: 'Charge Date' })
      await assertAndTrack(parent.next_charge_schedule_at, child.next_charge_schedule_at, { ...attributes, message: 'Charge Date' })
      await assertAndTrack(parent.order_interval_frequency, child.order_interval_frequency, { ...attributes, message: 'Interval Frequency' })
      await assertAndTrack(parent.order_interval_unit, child.order_interval_unit, { ...attributes, message: 'Interval Unit' })
    }
  }
}
