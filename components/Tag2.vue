<template>
  <div 
    :style="{ width, height }"
    :class="[bgColor, { 'cursor-pointer': button }]"
    class="center-xy rounded-md px-2 py-[2px]">
    <div class="tag flex flex-row items-center" :class="[textColor]">
      <div v-if="useDot" 
        class="rounded-full w-2 h-2 mr-2" 
        :class="[dotColor]"/> 
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  color: { type: String, required: true }, 
  button: Boolean,
  height: String,
  useDot: Boolean,
  width: String, 
})

// This crap is because I couldn't get the tailwind purger to not purge these classes
const bgColor = computed(() => {
  return {
    'teal': 'bg-green-background',
    'blue': 'bg-blue-background',
    'dark-blue': 'bg-blue-primary',
    'purple': 'bg-purple-background',
    'orange': 'bg-orange-background',
    'red': 'bg-red-background',
    'gray': 'bg-gray-border',
  }[props.color]
})

const dotColor = computed(() => {
  return {
    'teal': 'bg-green-primary',
    'blue': 'bg-blue-primary',
    'dark-blue': 'bg-white',
    'purple': 'bg-purple-secondary',
    'orange': 'bg-orange-secondary',
    'red': 'bg-red-secondary',
  }[props.color]
})

const textColor = computed(() => {
  return {
    'teal': 'text-green-primary',
    'blue': 'text-blue-primary',
    'dark-blue': 'text-white',
    'purple': 'text-purple-secondary',
    'orange': 'text-orange-secondary',
    'red': 'text-red-secondary',
    'gray': 'text-gray-mid'
  }[props.color]
})
</script>

<style lang="postcss" scoped>
</style>