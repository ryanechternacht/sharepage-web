<template>
  <div class="flex flex-col">
    <div class="flex flex-row gap-2">
      <img :src="partner.logo" class="h-8 w-8">
      <div class="text-3xl">{{ partner.name }}</div>
      <div class="flex-grow" />

      <button class="partner-button">🪐 Joint Value</button>
      <button class="partner-button">🚀 Partner Value</button>
      <button class="partner-button">📓 Resources</button>
      <span>Lead Accepted</span>
    </div>
    <h3>Why We Partner</h3>
      <span class="partner-content">
        {{ partner.jointValue.whyWePartner }}
      </span>
    <div>
      
    </div>
    <h3>Key Features</h3>
    <ul class="list-disc list-inside">
      <li v-for="i in partner.jointValue.keyFeatures"
        class="partner-content">{{ i }}</li>
    </ul>
    <h3>How we work together</h3>
    <ul class="list-disc list-inside">
      <li v-for="i in partner.jointValue.howWeWorkTogether"
        class="partner-content">{{ i }}</li>
    </ul>
  </div>
</template>

<script setup>
  const props = defineProps({
    partner: String
  })
</script>

<script>
export default {
}
</script>

<style lang="postcss" scoped>
.partner-button {
  @apply border border-gray-400 rounded-lg p-2;
}

h3 {
  @apply font-bold;
}

.partner-content {
  @apply text-gray-600 text-sm;
}
</style>