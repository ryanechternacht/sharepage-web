<template>
  <div class="flex flex-row gap-x-4 items-center">
    <!-- TODO this should become a logo (and the same as the topnav) -->
    <UserAvatar :user="person" />
    <div class="flex flex-col">
      <p class="gray">{{ person.firstName }} {{ person.lastName }}</p>
      <p class="gray-italic">{{ person.displayRole }}</p>
    </div>
    <div class="flex-grow" />
  </div>
</template>

<script setup>
const props = defineProps({
  person: Object
})
</script>

<style lang="postcss" scoped>
</style>