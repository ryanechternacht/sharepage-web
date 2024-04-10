<template>
  <BsButton :color="color" :hover-color="hoverColor">
    <div v-if="showText"
      class="mr-2 body-header">{{ text }}</div>
    <PlusSquareIcon />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  hoverColor: { type: String, default: "blue" },
  showText: { type: Boolean, default: true },
  text: { type: String, default: "New"}
})
</script>

<style lang="postcss" scoped>
</style>
