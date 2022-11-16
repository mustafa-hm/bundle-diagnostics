import axios from 'axios'

export const recharge = axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  headers: {
    'X-Recharge-Access-Token': process.env.RECHARGE_API_TOKEN,
    'X-Recharge-Version': '2021-11'
  }
})

export default recharge
