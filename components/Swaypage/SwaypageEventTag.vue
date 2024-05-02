<template>
  <div class="border border-gray-border rounded-md py-.5 px-2 flex flex-row gap-4 items-center">
    <Link2Icon class="icon-submenu gray-subtext" />
    
    <div class="subtext">{{ eventMap[event.eventType].text }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: { type: Object, required: true }
})

const eventMap = {
  'click-link': {
    text: "Link Click",
  },
  'click-share': {
    text: "Swaypage Shared",
  }
}
</script>

<style lang="postcss" scoped>
</style>
