<template>
  <BsButton :color="color">
    <div v-if="showText"
      class="mr-2 body-header">New</div> 
    <img src="/svg/new-thing.svg">
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true }
})
</script>
