<template>
  <tr>
    <td>
      <a :href="customerUrl(issue.customer_id)" target="_blank">
        {{ issue.customer_id }}
      </a>
    </td>
    <td>
      <a :href="chargeUrl(issue.charge_id)" target="_blank">
        {{ issue.charge_id }}
      </a>
    </td>
    <td>
      {{ issue.scheduled_at && formatDate(issue.scheduled_at) }}
    </td>
    <td>
      {{ issue.bundle_id }}
    </td>
    <td>
      <template v-if="Array.isArray(issue.data)">
        <button @click="store.issue = issue">
          {{ issue.data.length }}
        </button>
      </template>
    </td>
    <td>
      {{ formatDateTime(issue.created_at) }}
    </td>
    <td>
      <a :href="portalUrl(issue.customer_id)" target="_blank">
        view portal
      </a>
    </td>
  </tr>
</template>

<script setup>
import store from '@/store'
import { formatDate, formatDateTime } from '@/services/formatters'

defineProps({
  issue: Object
})

const rechargeUrl = (path) => `https://oats-3-sp.admin.rechargeapps.com/merchant/${path}`
const customerUrl = (id) => rechargeUrl(`customers/${id}`)
const chargeUrl = (id) => rechargeUrl(`orders/charges/${id}`)
const portalUrl = (id) => `https://oats-cs-portal-tool.herokuapp.com/portal/${id}`
</script>
