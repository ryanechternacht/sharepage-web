<template>
  <div class="flex flex-col gap-y-2">
    <PersonRow v-for="person in people" :person="person" />
  </div>
</template>

<script setup>
const props = defineProps({ people: Array})
</script>

<style lang="postcss" scoped>
</style>