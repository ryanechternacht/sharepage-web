<template>
  <div class="owner">
    <img :src="person.logo" class="h-8 max-w-16">
    <span>{{ person.name }}</span>
    <div class="flex-grow" />
    <div class="tag">{{ person.title  }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  person: Object
})
</script>

<style lang="postcss" scoped>
.owner {
  @apply flex flex-row gap-2 items-center p-2;

  &:hover {
    @apply rounded-lg bg-gray-100;
  }
}</style>