import { addDays } from 'date-fns'
import recharge from './recharge.js'
import { verifyCustomer } from './customer.js'
import { createIssues } from './issues.js'
import { timer } from './utils.js'

const RECHARGE_SCHEDULED_OUT_DAYS = parseInt(process.env.RECHARGE_SCHEDULED_OUT_DAYS || 2)

export default async function () {
  const maxDate = addDays(new Date(), RECHARGE_SCHEDULED_OUT_DAYS)
  console.log('> Loading charges up until', maxDate)
  let page = 1
  const fetchCharges = async (page) => {
    const { data } = await recharge.get(`/charges?status=queued,pending&sort_by=scheduled_at-asc&scheduled_at_max=${maxDate.toJSON()}&page=${page}`)
    return data.charges
  }
  let charges = await fetchCharges(page)
  while (charges?.length) {
    for (const charge of charges) {
      const { customer, id: charge_id, scheduled_at } = charge
      const issues = await verifyCustomer(customer.id)
      if (parseInt(charge.total_price) === 0) {
        issues.push({
          type: 'Free Charge'
        })
      }
      await createIssues({
        customer_id: customer.id,
        charge_id,
        scheduled_at,
        issues
      })
      await timer(250)
    }
    await timer(500)
    page += 1
    charges = await fetchCharges(page)
  }
  console.log('>> Charge Checkup Complete <<')
}
