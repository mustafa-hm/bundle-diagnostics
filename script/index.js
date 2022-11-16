import { reset } from './src/issues.js'
import bigQuery from './src/big-query.js'
import rechargeCharges from './src/recharge-charges.js'

async function main() {
  console.log('=================================')
  console.log('// Resetting Issues')
  await reset()

  console.log('=================================')
  console.log('// Processing BigQuery')
  await bigQuery()

  console.log('=================================')
  console.log('// Processing Upcoming Charges')
  await rechargeCharges()
}

main()
