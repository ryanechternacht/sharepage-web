<template>
  <BsButton id="btn" :color="color" hover-color="blue">
    <div v-if="showText"
      class="body-header mr-2">Reactivate</div>
    <PlayIcon />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true }
})
</script>

<style lang="postcss" scoped>
</style>
