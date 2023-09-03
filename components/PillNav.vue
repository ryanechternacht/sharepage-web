<template>
  <div class="w-full justify-center flex flex-row items-center gap-x-4">
    <BsButton
      v-for="o in options"
      :color="o === selected ? 'teal' : 'none'"
      @click="emit('update:selected', o)">{{ capitalize(o) }}</BsButton>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { capitalize } = lodash_pkg;

const { options, selected } = defineProps({ options: Array, selected: String })
const emit = defineEmits(['update:selected'])
</script>

<style lang="postcss" scoped>
</style>