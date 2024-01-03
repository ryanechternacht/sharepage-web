<template>
  <BsButton id="btn" :color="color" hover-color="red">
    <div v-if="showText"
      class="tag mr-2">Delete</div> 
    <div id="trash-can" />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: false }
})
</script>

<style lang="postcss" scoped>
#trash-can {
  mask: url(/svg/trash-can.svg);

  @apply bg-gray-body;
  width: 14px;
  height: 14px;
}

#btn:hover #trash-can {
  @apply bg-white;
}
</style>
