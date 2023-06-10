<template>
  <button 
    :class="{primary: variant === 'primary'}" 
    @click="clicked">
    <slot />
  </button>
</template>

<script setup>
  const props = defineProps({
    variant: String
  })

  const emit = defineEmits(['click'])

  const clicked = () => {
    emit('click')
  }
</script>

<style lang="postcss" scoped>
button {
  @apply border border-gray-light rounded-lg p-2 text-xs font-semibold
    text-gray;
}

button:hover {
  @apply bg-gray-light;
}

button.primary, button.primary:hover {
  @apply bg-blue text-white;
}
</style>