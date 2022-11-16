import { reset } from './src/issues.js'
import bigQuery from './src/big-query.js'
import rechargeCharges from './src/recharge-charges.js'

const {
  RESET,
  BIG_QUERY,
  RECHARGE
} = process.env

async function main () {
  if (RESET) {
    console.log('=================================')
    console.log('// Resetting Issues')
    await reset()
  }

  if (BIG_QUERY) {
    console.log('=================================')
    console.log('// Processing BigQuery')
    await bigQuery()
  }

  if (RECHARGE) {
    console.log('=================================')
    console.log('// Processing Upcoming Charges')
    await rechargeCharges()
  }
}

main()
