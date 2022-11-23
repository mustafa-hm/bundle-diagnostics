import axios from 'axios'

export const recharge = axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  headers: {
    'X-Recharge-Access-Token': process.env.RECHARGE_API_TOKEN,
    'X-Recharge-Version': '2021-11'
  }
})

export async function getSubscriptions (customerId) {
  const { data } = await recharge.get(`/subscriptions?customer_id=${customerId}&limit=250&page=1&status=active`)
  return data.subscriptions
}

export default recharge

