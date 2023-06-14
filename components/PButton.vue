<template>
  <button 
    :class="[hoverBgClass, hoverTextClass, selectedClass]"
    @click="clicked">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: String,
  selected: Boolean,
})

const emit = defineEmits(['click'])

const clicked = () => {
  emit('click')
}

// This garbage is because I couldn't get tailwind safelisting working correctly
// and the classes were getting purged by tailwind
const hoverBgClass = computed(
  () => ({
    'red-light': 'hover:bg-red-light',
    'blue-light': 'hover:bg-blue-light',
    'teal-light': 'hover:bg-teal-light',
    'yellow-light': 'hover:bg-yellow-light',
    'purple-light': 'hover:bg-purple-light',
    'gray-light': 'hover:bg-gray-light',
    '': 'hover:bg-gray'
  }[props.variant ?? ''])
)

const hoverTextClass = computed(
  () => ({
    'red-light': 'hover:text-blue-dark',
    'blue-light': 'hover:text-blue-dark',
    'teal-light': 'hover:text-blue-dark',
    'yellow-light': 'hover:text-blue-dark',
    'purple-light': 'hover:text-blue-dark',
    'gray-light': 'hover:text-blue-dark',
    '': 'hover:text-white'
  }[props.variant ?? ''])
)

const selectedClass = computed(
  () => {
    if (props.selected) {
      return {
        'red-light': 'bg-gray-',
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

</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md body;
  @apply font-bold;
}
</style>