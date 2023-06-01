<template>
  <div class="owner">
    <img :src="person.logo" class="h-6 max-w-12">
    <span class="text-sm font-semibold text-gray-600">{{ person.name }}</span>
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
}

.tag {
  @apply border-2 border-gray-300 rounded text-gray-500 text-xs py-[2px] px-2;
}
</style>