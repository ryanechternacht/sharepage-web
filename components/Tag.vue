<template>
  <div 
    :style="{ width, height }"
    :class="[bgColor, thin ? thin : '']"
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
    'teal': 'bg-teal-pastel',
    'blue': 'bg-blue-pastel',
    'green': 'bg-green-pastel',
    'purple': 'bg-purple-pastel',
    'orange': 'bg-orange-pastel',
    'red': 'bg-red-pastel',
    'gray': 'bg-gray-lighter',
    'yellow': 'bg-yellow-pastel'
  }[color ?? 'gray']
})
</script>

<style lang="postcss" scoped>

</style>