import { AssertionError } from 'assert'

export const assert = (parent, child, unit) => {
  console.assert(parent === child, `${unit}; parent=${parent}, child=${child}`)
  if (parent === child) {
    return true
  }
  throw new AssertionError({
    expected: parent,
    actual: child,
    message: unit
  })
}

export const timer = ms => new Promise(res => setTimeout(res, ms))

export const getPackSize = (item) => {
  try {
    return Number(item.variant_title.match(/\d+/)[0])
  } catch (e) {
    console.warn(e)
  }
}

export const getProp = (item, propName) => {
  const prop = item.properties.find((p) => p.name === propName)
  return prop && prop.value
}

export const filterBundleItems = (items, bundleId, bundleType) => {
  return items.filter((item) => {
    return String(getProp(item, '__bundle_id')) === bundleId &&
      String(getProp(item, '__bundle_type')) === bundleType
  })
}

export const groupBundles = (subscriptions) => {
  const parentIds = subscriptions.filter((i) => getProp(i, '__bundle_type') === 'parent').map(i => String(getProp(i, '__bundle_id')))
  const bundledIds = []
  const bundles = parentIds.map((id) => {
    const parent = filterBundleItems(subscriptions, id, 'parent')[0]
    const children = filterBundleItems(subscriptions, id, 'child')
    bundledIds.push(parent.id)
    children.map(i => bundledIds.push(i.id))
    return {
      id,
      size: getPackSize(parent),
      totalQuantity: children.reduce((sum, i) => sum += i.quantity, 0),
      parent,
      children
    }
  })
  const unbundled = subscriptions.filter(i => !bundledIds.includes(i.id))
  return {
    bundles,
    unbundled
  }
}

// export const makeBundle = (subscriptions) => {
//   const parent = subscriptions.find((i) => getProp(i, '__bundle_type') === 'parent')
//   if (!parent) {
//     return
//   }
//   const id = String(getProp(parent, '__bundle_id'))
//   const children = filterBundleItems(subscriptions, id, 'child')
//   return {
//     id,
//     parent,
//     children
//   }
// }

