<template>
  <div>
    <h3>Why We Partner</h3>
      <span class="partner-content">
        {{ jointValue.whyWePartner }}
      </span>
    <div>
      
    </div>
    <h3>Key Features</h3>
    <ul class="list-disc list-inside">
      <li v-for="i in jointValue.keyFeatures"
        class="partner-content">{{ i }}</li>
    </ul>
    <h3>How we work together</h3>
    <ul class="list-disc list-inside">
      <li v-for="i in jointValue.howWeWorkTogether"
        class="partner-content">{{ i }}</li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  jointValue: Object
})
</script>

<style lang="postcss" scoped>
.partner-content {
  @apply text-gray-600 text-sm;
}</style>