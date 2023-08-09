<template>
  <div class="flex flex-row gap-x-4 items-center">
    <LetterAvatar :letter="person.firstName[0]" />
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