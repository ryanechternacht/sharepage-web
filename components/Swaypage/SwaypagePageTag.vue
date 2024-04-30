<template>
  <div class="border border-gray-border rounded-md py-.5 px-1 flex flex-row gap-4 items-center">
    <FileIcon v-if="event.pageType === 'general'" class="icon-submenu gray-subtext" />
    <ArrowRightCircleIcon v-else-if="event.pageType === 'follow-up'" class="icon-submenu gray-subtext" />
    <MapIcon v-else-if="event.pageType === 'guide'" class=" icon-submenu gray-subtext" />
    <MessageCircleIcon v-else-if="event.pageType === 'discussion'" class="icon-submenu gray-subtext" />
    <FileTextIcon v-else-if="event.pageType === 'business-case'" class="icon-submenu gray-subtext" />
    <ClipboardIcon v-else-if="event.pageType === 'notes'" class="icon-submenu gray-subtext" />
    
    <div class="subtext">{{ event.title }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true }
})
</script>

<style lang="postcss" scoped>
</style>
