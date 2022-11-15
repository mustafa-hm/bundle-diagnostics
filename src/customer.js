import recharge from './recharge.js'
import { assert, groupBundles } from './utils.js'

export async function getSubscriptions (customerId) {
  const { data } = await recharge.get(`/subscriptions?customer_id=${customerId}&limit=250&page=1&status=active`)
  return data.subscriptions
}

export async function verifyCustomer (customerId) {
  const subs = await getSubscriptions(customerId)
  const { bundles, unbundled } = groupBundles(subs)
  console.log('> Verifying customer', customerId, 'bundles', bundles.length, 'unbundled', unbundled.length)
  try {
    assert(0, unbundled.length, 'Orphaned Subs')
    for (const bundle of bundles) {
      const { parent, children, size, totalQuantity } = bundle
      assert(size, totalQuantity, 'Bundle Size')
      for (const child of children) {
        assert(parent.address_id, child.address_id, 'Charge Date')
        assert(parent.next_charge_schedule_at, child.next_charge_schedule_at, 'Charge Date')
        assert(parent.order_interval_frequency, child.order_interval_frequency, 'Interval Frequency')
        assert(parent.order_interval_unit, child.order_interval_unit, 'Interval Unit')
      }
    }
  } catch (e) {
    if (e instanceof AssertionError) {
      console.log('------------')
      console.log('>> Customer Verification Failed <<')
      console.log('    customerId:', customerId)
      console.log('    message:', e.message)
      console.log('    expected:', e.expected, 'actual:', e.actual)
      console.log('------------')
    } else {
      console.error(e)
    }
    process.exit(1)
  }
}
