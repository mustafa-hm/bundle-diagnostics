import { AssertionError } from 'assert'
import recharge from './recharge.js'
import { assert, getProp, groupBundles } from './utils.js'
import { createIssue } from './issues.js'

export async function getSubscriptions (customerId) {
  const { data } = await recharge.get(`/subscriptions?customer_id=${customerId}&limit=250&page=1&status=active`)
  return data.subscriptions
}

const report = (e) =>{
  const { message, expected, actual } = e
  console.log('------------')
  console.log('>> Assertion Verification Failed <<')
  console.log('    message:', message)
  console.log('    expected:', expected, 'actual:', actual)
  console.log('------------')
}

export async function verifyCustomer (customerId) {
  const issues = []
  const subs = await getSubscriptions(customerId)


  const assertAndReport = async (expected, actual, attributes) => {
    try {
      assert(expected, actual, attributes.type)
    } catch (e) {
      if (e instanceof AssertionError) {
        report(e)
        issues.push({
          ...attributes,
          expected,
          actual
        })
      } else {
        throw e
      }
    }
  }

  const { bundles, unbundled } = groupBundles(subs)
  console.log('> Verifying customer', customerId, 'bundles', bundles.length, 'unbundled', unbundled.length)

  await assertAndReport(0, unbundled.filter(i => getProp('__bundle_id')).length, { type: 'Orphaned Subs' })

  for (const bundle of bundles) {
    const { id, parent, children, size, totalQuantity } = bundle
    await assertAndReport(size, totalQuantity, { bundle_id: id, type: 'Bundle Size' })
    for (const child of children) {
      await assertAndReport(parent.address_id, child.address_id, { bundle_id: id, type: 'Charge Date' })
      await assertAndReport(parent.next_charge_schedule_at, child.next_charge_schedule_at, { bundle_id: id, type: 'Charge Date' })
      await assertAndReport(parent.order_interval_frequency, child.order_interval_frequency, { bundle_id: id, type: 'Interval Frequency' })
      await assertAndReport(parent.order_interval_unit, child.order_interval_unit, { bundle_id: id, type: 'Interval Unit' })
    }
  }

  return issues
}
