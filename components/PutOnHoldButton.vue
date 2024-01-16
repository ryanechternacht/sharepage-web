<template>
  <BsButton id="btn" :color="color" hover-color="red">
    <div v-if="showText"
      class="body-header mr-2">Put on Hold</div> 
    <PauseIcon />
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
