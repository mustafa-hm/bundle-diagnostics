<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Charge ID</th>
          <th>Charge Date</th>
          <th>Bundle ID</th>
          <th>Issues</th>
          <th>Created At</th>
          <th>Portal</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="issue in issues"
          :key="issue.id"
        >
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
            {{ Array.isArray(issue.data) ? issue.data.length : '' }}
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
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from './services/supabase'
import { formatDate, formatDateTime } from './services/formatters'

const rechargeUrl = (path) => `https://oats-3-sp.admin.rechargeapps.com/merchant/${path}`
const customerUrl = (id) => rechargeUrl(`customers/${id}`)
const chargeUrl = (id) => rechargeUrl(`orders/charges/${id}`)
const portalUrl = (id) => `https://oats-cs-portal-tool.herokuapp.com/portal/${id}`

const issues = ref()

const loadRecords = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select()
    .order('scheduled_at')
    .order('customer_id')
    .order('bundle_id')
    .order('data->message')
  if (error) {
    console.error(error)
  } else if (data) {
    issues.value = data
  }
}

loadRecords()
</script>
