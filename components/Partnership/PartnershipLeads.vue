<template>
  <div class="flex flex-col gap-2">
    <!-- TODO make these links to the leads page -->
    <div
      v-for="lead in partner?.leads?.leads"
      :key="lead.name"
      class="lead-item"
    >
      <img :src="lead.logo" class="h-8 max-w-16">
      <span>{{ lead.name }}</span>

      <div class="flex-grow" />
      <div class="flex flex-col text-xs text-gray-500 gap-1">
        <span>Our: {{ lead.dealStage }}</span>
        <span>Their: {{ lead.partnerDealStage }}</span>
      </div>
      <div 
        v-for="tag in lead.tags"
        :key="tag"
        class="border-2 border-gray-300 rounded text-gray-500 text-xs p-1"
      >
        {{ tag }}
      </div>
      <div class="text-gray-500 text-xs">
        <span v-if="lead.status === 'Active'">🟢</span>
        <span v-else-if="lead.status === 'Not Active'">🔴</span>
        {{ lead.status }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object
})
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.lead-item {
  @apply border border-gray-200 rounded-lg flex flex-row gap-x-4 
    px-4 py-4 items-center;
}

.lead-item:hover {
  @apply bg-gray-100;
}
</style>
