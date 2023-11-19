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
const { color } = defineProps({ 
  color: { type: String, required: true }, 
  button: Boolean,
  height: String,
  useDot: Boolean,
  width: String, 
})

// This crap is because I couldn't get the tailwind purger to not purge these classes
const bgColor = computed(() => {
  return {
    'teal': 'bg-teal-background',
    'blue': 'bg-blue-background',
    'green': 'bg-green-background',
    'purple': 'bg-purple-background',
    'orange': 'bg-orange-background',
    'red': 'bg-red-background',
    'yellow': 'bg-yellow-background'
  }[color]
})

const dotColor = computed(() => {
  return {
    'teal': 'bg-teal-bright',
    'blue': 'bg-blue-bright',
    'green': 'bg-green-bright',
    'purple': 'bg-purple-bright',
    'orange': 'bg-orange-bright',
    'red': 'bg-red-bright',
    'yellow': 'bg-yellow-bright'
  }[color]
})

const textColor = computed(() => {
  return {
    'teal': 'text-teal-bright',
    'blue': 'text-blue-bright',
    'green': 'text-green-bright',
    'purple': 'text-purple-bright',
    'orange': 'text-orange-jewel', // INTENTIONAL
    'red': 'text-red-bright',
    'yellow': 'text-yellow-bright'
  }[color]
})
</script>

<style lang="postcss" scoped>
</style>