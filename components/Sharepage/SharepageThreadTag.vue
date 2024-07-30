<template>
  <div class="border border-gray-200 rounded-md py-.5 px-2 grid-layout bg-white">
    <SharepagePageTypeIcon :page-type="event.pageType" 
      class="text-gray-500" />
    
    <div class="subtext">{{ event.title }}</div>
    
    <template v-if="event.eventType === 'click-link'">
      <div><!-- empty --></div>
      <div class="flex flex-row items-center">
        <span class="mr-2 subtext">></span>
        <div  class="subtext">
          {{ event.eventData.linkText }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true }
})

const icon = computed(() => ({
  general: 'i-heroicons-document',
  'follow-up': 'i-heroicons-arrow-right-circle',
  guide: 'i-heroicons-map',
  discussion: 'i-heroicons-chat-bubble-left',
  'business-case': 'i-heroicons-document-chart-bar',
  notes: 'i-heroicons-clipboards',
}[props.event.pageType]))
</script>

<style lang="postcss" scoped>
.grid-layout {
  @apply grid gap-x-2 gap-y-1 items-center;
  grid-template-columns: auto auto;
}
</style>
