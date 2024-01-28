<template>
  <div class="bs-button center-xy shrink-0"
    :class="[{ big }, colorClasses, hoverColorClasses]">
    <slot />
  </div>
</template>

<script setup>
// TODO consider a BsButtonLink element, or a way to make this render
// as a link for better site semantics
const props = defineProps({ 
  big: Boolean,
  color: String,
  hoverColor: String,
})

const colorClasses = computed(() => ({
  'none': 'border border-gray-hover-active bg-white',
  'teal': 'bg-green-primary text-white',
  'blue': 'bg-blue-primary text-white',
}[props.color ?? 'none']))

const hoverColorClasses = computed(() => ({
  'none': 'hover:bg-gray-hover',
  'gray': 'hover:bg-gray-hover',
  'blue': 'hover:bg-blue-primary hover:text-white hover:border-blue-primary',
  'red': 'hover:bg-red-secondary hover:text-white hover:border-red-secondary',
  'green': 'hover:bg-green-primary hover:text-white hover:border-green-primary',
}[props.hoverColor ?? 'none']))
</script>

<style lang="postcss" scoped>
.bs-button {
  @apply cursor-pointer px-2 py-1 rounded-md whitespace-nowrap;

  &.big {
    @apply py-1 px-6;
  }

  &.hover\:text-white:hover :slotted(*) {
    @apply text-white;
  }
}
</style>