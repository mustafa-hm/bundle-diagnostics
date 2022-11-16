import recharge from './recharge.js'
import { addDays } from 'date-fns'
import { verifyCustomer } from './customer.js'
import { createIssues } from './issues.js'

export default async function () {
  const twoDaysOut = addDays(new Date(), 2)
  let page = 1
  const fetchCharges = async (page) => {
    const { data } = await recharge.get(`/charges?customer_id=50944315&status=queued,pending&sort_by=id-asc&scheduled_at_max=${twoDaysOut.toJSON()}&page=${page}`)
    return data.charges
  }
  let charges = await fetchCharges(page)
  while (charges?.length) {
    for (const charge of charges) {
      const { customer_id, id: charge_id, scheduled_at } = charge
      const issues = await verifyCustomer(customer_id)
      if (parseInt(charge.total_price) === 0) {
        issues.push({
          type: 'Free Charge'
        })
      }

      await createIssues({
        customer_id,
        charge_id,
        scheduled_at,
        issues
      })
    }
    page += 1
    charges = await fetchCharges(page)
  }
  console.log('>> Charge Checkup Complete <<')
}
