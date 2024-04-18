<template>
  <BsButton :color="color" hover-color="blue">
    <div v-if="showText"
      class="body-header mr-2">{{ editText }}</div>
    <Edit2Icon />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: false },
  editText: { type: String, default: "Edit" },
})
</script>

<style lang="postcss" scoped>
</style>
