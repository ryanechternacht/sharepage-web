<template>
  <div class="border border-gray-200 rounded-md py-.5 px-2 grid-layout bg-white">
    <FileIcon v-if="event.pageType === 'general'" class="icon-submenu gray-500" />
    <ArrowRightCircleIcon v-else-if="event.pageType === 'follow-up'" class="icon-submenu gray-500" />
    <MapIcon v-else-if="event.pageType === 'guide'" class=" icon-submenu gray-500" />
    <MessageCircleIcon v-else-if="event.pageType === 'discussion'" class="icon-submenu gray-500" />
    <FileTextIcon v-else-if="event.pageType === 'business-case'" class="icon-submenu gray-500" />
    <ClipboardIcon v-else-if="event.pageType === 'notes'" class="icon-submenu gray-500" />
    
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
</script>

<style lang="postcss" scoped>
.grid-layout {
  @apply grid gap-x-2 gap-y-1 items-center;
  grid-template-columns: auto auto;
}
</style>
