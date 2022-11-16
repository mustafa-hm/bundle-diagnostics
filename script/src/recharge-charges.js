import recharge from './recharge.js'
import { addDays } from 'date-fns'
import { verifyCustomer } from './customer.js'

export default async function () {
  const twoDaysOut = addDays(new Date(), 2)
  let page = 1
  const fetchCharges = async (page) => {
    const { data } = await recharge.get(`/charges?status=queued,pending&sort_by=id-asc&scheduled_at_max=${twoDaysOut.toJSON()}&page=${page}`)
    return data.charges
  }
  let charges = await fetchCharges(page)
  while (charges?.length) {
    for (const charge of charges) {
      await verifyCustomer(charge.customer_id)
    }
    page += 1
    charges = await fetchCharges(page)
  }
  console.log('>> Charge Checkup Complete <<')
}
