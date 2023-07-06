<template>
  <div 
    class="flex flex-col items-center"
    :class="[height, width]"
  >
    <img :src="src" :class="[maxHeight, maxWidth]">
  </div>
</template>

<script setup>
const props = defineProps({ src: String, size: String })

// This garbage is because I couldn't get tailwind safelisting working correctly
// and the classes were getting purged by tailwind
const height = computed( 
  () => ({
    'medium': 'h-[1.5rem]',
    'large': 'h-[2.5rem]',
  }[props.size ?? 'medium'])
)
const width = computed(
  () => ({
    'medium': 'w-[1.5rem]',
    'large': 'w-[2.5rem]',
  }[props.size ?? 'medium'])
)
const maxHeight = computed(
  () => ({
    'medium': 'max-h-[1.5rem]',
    'large': 'max-h-[2.5rem]',
  }[props.size ?? 'medium'])
)
const maxWidth = computed(
  () => ({
    'medium': 'max-w-[1.5rem]',
    'large': 'max-w-[2.5rem]',
  }[props.size ?? 'medium'])
)
</script>

<style lang="postcss" scoped>
.deal-logo {
  @apply w-[2.25rem] h-[2.25rem] ;

  * {
    @apply max-h-[2.25rem] max-w-[2.25rem];
  }
}
</style>
