<template>
  <div class="center-xy">
    <img v-if="src && !loadingError"
      :src="src"
      @error="loadingError = true">
  </div>
</template>

<script setup>
const props = defineProps({ src: String, size: String })

const loadingError = ref(false)
</script>

<style lang="postcss" scoped>
</style>
