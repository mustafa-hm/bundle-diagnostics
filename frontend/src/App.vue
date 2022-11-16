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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <IssueRow
          v-for="issue in issues"
          :key="issue.id"
          :issue="issue"
        />
      </tbody>
    </table>
    <IssueModal
      v-if="store.issue"
      :issue="store.issue"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/services/supabase'
import store from '@/store'

import IssueRow from '@/components/IssueRow.vue'
import IssueModal from '@/components/IssueModal.vue'

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
