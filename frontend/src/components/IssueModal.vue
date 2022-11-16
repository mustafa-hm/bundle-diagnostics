<template>
  <Teleport to="body">
    <div
      class="modal"
      @click.self="store.issue = null"
    >
      <div class="modal-content">
        <button @click="store.issue = null">close</button>
        <h1>Customer {{ issue.customer_id }}</h1>
        <pre>{{ issue }}</pre>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import store from '@/store'
defineProps({
  issue: Object
})
</script>
