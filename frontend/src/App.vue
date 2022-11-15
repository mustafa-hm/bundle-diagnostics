<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Issue</th>
          <th>Expected</th>
          <th>Actual</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="issue in issues"
          :key="issue.id"
        >
          <td>
            <a :href="url(issue.customer_id)" target="_blank">
              {{ issue.customer_id }}
            </a>
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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const url = (id) => `https://oats-3-sp.admin.rechargeapps.com/merchant/customers/${id}`

const issues = ref()

const loadRecords = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select()
    .order('customer_id')
  if (error) {
    console.error(error)
  } else if (data) {
    issues.value = data
  }
}

loadRecords()
</script>
