<template>
  <Teleport to="body">
    <div
      class="modal"
      @click.self="store.issue = null"
    >
      <div class="modal-content">
        <button @click="store.issue = null">close</button>
        <h1>
          Customer
          <a :href="urls.customerUrl(issue.customer_id)" target="_blank">
            {{ issue.customer_id }}
          </a>
        </h1>
        <pre>{{ issue }}</pre>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import store from '@/store'
import urls from '@/services/urls'

defineProps({
  issue: Object
})
</script>
