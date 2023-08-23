<template>
  <div 
    :style="{ width, height }"
    :class="[bg]"
    class="flex flex-col items-center rounded-full justify-center px-2 py-[2px]">
    <div class="gray tag">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ bg: String, width: String, height: String })
</script>

<style lang="postcss" scoped>
</style>