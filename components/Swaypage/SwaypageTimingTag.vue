<template>
  <div class="border border-gray-200 rounded-md py-.5 px-2 flex flex-row gap-4 items-center bg-white">
    <UIcon class="icon-submenu text-gray-500" name="i-heroicons-eye" />
    <div class="subtext">{{ formatTime(timing.timeOnPage) }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  timing: { type: Object, required: true }
})

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toString().padStart(2, '0')

  return `${mins}:${secs}`
}
</script>

<style lang="postcss" scoped>
</style>
