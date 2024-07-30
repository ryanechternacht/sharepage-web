<template>
  <div class="border border-gray-200 rounded-md py-.5 px-2 flex flex-row gap-4 items-center bg-white">
    <UIcon class="icon-submenu text-gray-500" name="i-heroicons-link" />
    
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
    text: "Sharepage Shared",
  }
}
</script>

<style lang="postcss" scoped>
</style>
