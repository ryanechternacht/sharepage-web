<template>
  <h1>Hello, world</h1>

  <button @click="tryApi">Try Api</button>
  <div>did it work? {{ status }}</div>
</template>

<script setup>
const { apiFetch } = useNuxtApp();

definePageMeta({
  middleware: ['dead-page'],
})

const status = ref('not tried')

async function tryApi () {
  status.value = 'trying'

  try {
    const {data, error} = await apiFetch('/')
    if (data) {
      status.value = data
    } else if (error) {
      status.value = error
    } else {
      status.value = 'unknown'
    }
  } catch ($ex) {
    status.value = `caught: ${$ex}`
  }
}
</script>

<style lang="postcss" scoped>
button {
  @apply p-2 border;
}
</style>