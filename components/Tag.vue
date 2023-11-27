<template>
  <div 
    :style="{ width, height }"
    :class="[bgColor]"
    class="center-xy rounded-full px-2 py-[2px]">
    <div class="gray tag">
      <slot />
    </div>
  </div>
</template>

<script setup>
const { color } = defineProps({ color: String, width: String, height: String })

const bgColor = computed(() => {
  return {
    'teal': 'bg-green-primary',
    'blue': 'bg-blue-primary',
    'purple': 'bg-purple-secondary',
    'orange': 'bg-orange-secondary',
    'red': 'bg-red-secondary',
    'gray': 'bg-cream-highlight',
  }[color ?? 'gray']
})
</script>

<style lang="postcss" scoped>

</style>