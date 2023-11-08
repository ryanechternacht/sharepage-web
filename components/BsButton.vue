<template>
  <div class="bs-button center-xy"
    :class="[{ big }, colorClasses]">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({ 
  big: Boolean,
  color: String
})

const colorClasses = computed(
  () => ({
    'none': 'border border-gray-light',
    'teal': 'bg-teal-primary text-white'
  }[props.color ?? 'none'])
)
</script>

<style lang="postcss" scoped>
.bs-button {
  @apply cursor-pointer px-2 rounded-md whitespace-nowrap	;

  &.big {
    @apply py-1 px-6;
  }
}
</style>