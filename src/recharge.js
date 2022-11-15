import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const recharge = axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  headers: {
    'X-Recharge-Access-Token': process.env.RECHARGE_API_TOKEN
  }
})

export default recharge
