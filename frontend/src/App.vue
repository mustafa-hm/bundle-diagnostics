<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Bundle ID</th>
          <th>Issue</th>
          <th>Expected</th>
          <th>Actual</th>
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
            <a :href="rechargeUrl(issue.customer_id)" target="_blank">
              {{ issue.customer_id }}
            </a>
          </td>
          <td>
            {{ issue.bundle_id }}
          </td>
          <td>
            {{ issue.data.message }}
          </td>
          <td>
            {{ issue.data.expected }}
          </td>
          <td>
            {{ issue.data.actual }}
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
import { formatDateTime } from './services/formatters'

const rechargeUrl = (id) => `https://oats-3-sp.admin.rechargeapps.com/merchant/customers/${id}`
const portalUrl = (id) => `https://oats-cs-portal-tool.herokuapp.com/portal/${id}`

const issues = ref()

const loadRecords = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select()
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
