import axios from 'axios'

export const recharge = axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  headers: {
    'X-Recharge-Access-Token': process.env.RECHARGE_API_TOKEN
  }
})

export default recharge
