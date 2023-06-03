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
  @apply border border-gray-300 rounded-lg p-2 text-xs font-semibold
    text-gray-500;
}

button:hover {
  @apply bg-gray-100;
}

button.primary, button.primary:hover {
  @apply bg-[#0500db] text-white;
}
</style>