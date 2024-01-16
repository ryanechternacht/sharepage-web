<template>
  <BsButton id="btn" :color="color" hover-color="blue">
    <div v-if="showText"
      class="mr-2 body-header">{{ text }}</div>
    <PlusSquareIcon />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true },
  text: { type: String, default: "New"}
})
</script>

<style lang="postcss" scoped>
</style>
