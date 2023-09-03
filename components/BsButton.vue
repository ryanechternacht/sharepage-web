<template>
  <div class="bs-button"
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
  @apply cursor-pointer px-2 rounded-md;

  &.big {
    @apply py-2 px-4;
  }
}
</style>