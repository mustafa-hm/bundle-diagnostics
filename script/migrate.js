import createBundleSelections from './src/migrate/create-bundle-selections.js'

const args = process.argv.slice(2)

async function main () {
  const customerId = Number(args.shift())
  if (!isNaN(customerId)) {
    console.log('> migrating customer', customerId)
    await createBundleSelections(customerId)
  } else {
    console.log('Error: missing customer ID')
    console.log('$ yarn script:migrate 123')
  }
}

main()
