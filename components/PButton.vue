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
    'gray': 'hover:bg-gray-lighter hover:text-blue-jewel',
    '': 'hover:bg-gray-lighter hover:text-white'
  }[props.variant ?? ''])
)

const selectedClass = computed(
  () => {
    if (props.selected) {
      return {
        'gray': 'bg-gray-lighter',
        '': 'bg-gray-lighter'
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