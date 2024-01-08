<template>
  <BsButton id="btn" :color="color" hover-color="red">
    <div v-if="showText"
      class="body-header mr-2">Put on Hold</div> 
    <div id="pause" />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true }
})
</script>

<style lang="postcss" scoped>
#pause {
  mask: url(/svg/pause.svg) center no-repeat;

  @apply bg-gray-body;
  width: 14px;
  height: 14px;
}

#btn:hover #pause {
  @apply bg-white;
}
</style>
