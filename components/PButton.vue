<template>
  <button 
    :class="[variantClass, selectedClass, sizeClass]"
    @click="clicked">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: String,
  selected: Boolean,
  size: String
})

const emit = defineEmits(['click'])

const clicked = () => {
  emit('click')
}

// This garbage is because I couldn't get tailwind safelisting working correctly
// and the classes were getting purged by tailwind
const variantClass = computed(
  () => ({
    'red-light': 'hover:bg-red-light hover:text-blue-dark',
    'blue-light': 'hover:bg-blue-light hover:text-blue-dark',
    'teal-light': 'hover:bg-teal-light hover:text-blue-dark',
    'yellow-light': 'hover:bg-yellow-light hover:text-blue-dark',
    'purple-light': 'hover:bg-purple-light hover:text-blue-dark',
    'gray-light': 'hover:bg-gray-light hover:text-blue-dark',
    '': 'hover:bg-gray hover:text-white'
  }[props.variant ?? ''])
)

const selectedClass = computed(
  () => {
    if (props.selected) {
      return {
        'red-light': 'bg-red-light',
        'blue-light': 'bg-blue-light',
        'teal-light': 'bg-teal-light',
        'yellow-light': 'bg-yellow-light',
        'purple-light': 'bg-purple-light',
        'gray-light': 'bg-gray-light',
        '': 'bg-gray'
      }[props.variant ?? '']
    } else {
      return ''
    }
  }
)

const sizeClass = computed(() => ({
  'medium': '',
  'large': 'text-base w-[2.5rem] h-[2.5rem]'
}[props.size ?? 'medium']))

</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md body;
  @apply font-bold;
}
</style>