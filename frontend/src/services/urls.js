export const rechargeUrl = (path) => `https://oats-3-sp.admin.rechargeapps.com/merchant/${path}`
export const customerUrl = (id) => rechargeUrl(`customers/${id}`)
export const chargeUrl = (id) => rechargeUrl(`orders/charges/${id}`)
export const portalUrl = (id) => `https://oats-cs-portal-tool.herokuapp.com/portal/${id}`

export default {
  rechargeUrl,
  customerUrl,
  chargeUrl,
  portalUrl
}
