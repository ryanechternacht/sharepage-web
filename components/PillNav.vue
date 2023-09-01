<template>
  <div class="w-full justify-center flex flex-row items-center gap-x-4">
    <div
      v-for="o in options"
      class="option"
      :class="{selected: o === selected}"
      @click="emit('update:selected', o)"
    >{{ capitalize(o) }}</div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { capitalize } = lodash_pkg;

const { options, selected } = defineProps({ options: Array, selected: String })
const emit = defineEmits(['update:selected'])
</script>

<style lang="postcss" scoped>
.option {
  @apply px-2 cursor-pointer rounded-md border border-gray-light text-gray-darker;
}

.option.selected {
  @apply border-0 bg-teal-primary text-white;
}
</style>