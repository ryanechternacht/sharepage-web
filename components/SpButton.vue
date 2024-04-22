<template>
  <div class="bs-button center-xy gap-3 shrink-0"
    :class="[colorClasses]">
    <slot name="icon" :class="colorClasses" class="icon-menu" />
    <slot />
  </div>
</template>

<script setup>
// TODO consider a BsButtonLink element, or a way to make this render
// as a link for better site semantics
const props = defineProps({ 
  // big: Boolean,
  color: String,
  // hoverColor: String,
})

const colorClasses = computed(() => ({
  // 'none': 'border border-gray-border bg-white',
  // 'teal': 'bg-green-primary text-white',
  'blue': 'bg-blue-brand text-white',
}[props.color ?? 'blue']))

// const hoverColorClasses = computed(() => ({
//   // 'none': 'hover:bg-gray-hover',
//   // 'gray': 'hover:bg-gray-hover',
//   // 'blue': 'hover:bg-blue-brand hover:text-white hover:border-blue-brand',
//   // 'red': 'hover:bg-red-secondary hover:text-white hover:border-red-secondary',
//   // 'green': 'hover:bg-green-primary hover:text-white hover:border-green-primary',
// }[props.hoverColor ?? 'blue']))
</script>

<style lang="postcss" scoped>
.bs-button {
  @apply cursor-pointer px-3 py-2 rounded-md whitespace-nowrap;

  /* &.big {
    @apply py-1 px-6;
  } */

  &.hover\:text-white:hover :slotted(*) {
    @apply text-white;
  }
}
</style>