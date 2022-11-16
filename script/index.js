import { reset } from './src/issues.js'
import rechargeCharges from './src/recharge-charges.js'

async function main() {
  console.log('=================================')
  console.log('// Resetting Issues //')
  await reset()
  console.log('=================================')
  console.log('// Processing Upcoming Charges //')
  await rechargeCharges()
}

main()
