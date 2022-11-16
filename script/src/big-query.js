import { AssertionError } from 'assert'
import { promises as fs } from 'fs'
import { BigQuery } from '@google-cloud/bigquery'

import { assert, timer } from './utils.js'
import { verifyCustomer } from './customer.js'

const credentials = JSON.parse(process.env.BIG_QUERY_CREDENTIALS)
const client = new BigQuery({ credentials })

async function getSubscriptions () {
  const query = String(await fs.readFile('../sql/invalid_bundles.sql'))
  const [ rows ] = await client.query({
    query,
    location: 'US'
  })
  return rows.reduce((acc, sub) => {
    acc[sub.customer_id] ||= {}
    acc[sub.customer_id][sub.parent_bundle_id] ||= []
    acc[sub.customer_id][sub.parent_bundle_id].push(sub)
    return acc
  }, {})
}

export default async function () {
  const subsByCustomer = await getSubscriptions()
  console.log('** Diagnosing %d customers', Object.keys(subsByCustomer).length)
  for (const [ customer_id, bundles ] of Object.entries(subsByCustomer)) {
    try {
      console.log('---')
      console.log('> Customer:', customer_id)
      for (const [ bundle_id, subs ] of Object.entries(bundles)) {
        for (const sub of subs) {
          assert(sub.parent_bundle_id, sub.child_bundle_id, 'Bundle ID')
          assert(sub.parent_address_id, sub.child_address_id, 'Address ID')
          assert(sub.parent_charge_at.value, sub.child_charge_at.value, 'Charge Date')
          assert(sub.parent_interval_freq, sub.child_interval_freq, 'Interval Freq')
          assert(sub.parent_interval_unit, sub.child_interval_unit, 'Interval Unit')
          assert(sub.bundle_size, sub.children_quantity, 'Bundle Size')
        }
      }
    } catch (e) {
      if (e instanceof AssertionError) {
        // error with data from BigQuery, fetch actual data from Recharge for verification
        await verifyCustomer(customer_id)
        await timer(250)
      } else {
        throw e
      }
    }
  }
}

