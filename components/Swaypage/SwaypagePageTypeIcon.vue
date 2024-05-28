<template>
  <UIcon :name="icon" />
</template>

<script setup>
const props = defineProps({
  pageType: { type: String, required: true }
})

const icon = computed(() => ({
  general: 'i-heroicons-document',
  'follow-up': 'i-heroicons-arrow-right-circle',
  guide: 'i-heroicons-map',
  discussion: 'i-heroicons-chat-bubble-left',
  'business-case': 'i-heroicons-document-chart-bar',
  notes: 'i-heroicons-clipboards',
}[props.pageType]))
</script>
