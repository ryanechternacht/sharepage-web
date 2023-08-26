<template>
  <div 
    :style="{ width, height }"
    :class="[bgColor]"
    class="flex flex-col items-center rounded-full justify-center px-2 py-[2px]">
    <div class="gray tag">
      <slot />
    </div>
  </div>
</template>

<script setup>
const { color } = defineProps({ color: String, width: String, height: String })

const bgColor = computed(() => {
  return {
    'teal': 'bg-teal-muted',
    'blue': 'bg-blue-muted',
    'green': 'bg-green-muted',
    'purple': 'bg-purple-muted',
    'orange': 'bg-orange-muted',
    'red': 'bg-red-muted',
    'gray': 'bg-gray-lighter',
    'yellow': 'bg-yellow-muted'
  }[color ?? 'gray']
})
</script>

<style lang="postcss" scoped>
</style>