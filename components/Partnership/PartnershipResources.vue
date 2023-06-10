<template>
  <div>
    <h3>Resources</h3>
    <div 
      v-for="r in partner?.resources?.items"
      :key="r.url"
      class="resource">
      <span class="text-2xl">{{ chooseIcon(r) }}</span>
      <a :href="r.url" target="_blank">{{ r.description }}</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object
})

const chooseIcon = (resource) => resource.url.endsWith('.pdf') ? '📖' : '🌐';
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}

.resource {
  @apply p-2 cursor-pointer flex flex-row items-center gap-x-2;

  &:hover {
    @apply bg-gray-light rounded-lg;
  }
}
</style>