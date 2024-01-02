<template>
  <BsButton :color="color">
    <div v-if="showText"
      class="tag mr-2">Edit</div> 
    <img src="/svg/pencil.svg">
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: false }
})
</script>