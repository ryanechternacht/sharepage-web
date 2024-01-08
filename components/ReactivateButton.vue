<template>
  <BsButton id="btn" :color="color" hover-color="blue">
    <div v-if="showText"
      class="body-header mr-2">Reactivate</div> 
    <div id="play" />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true }
})
</script>

<style lang="postcss" scoped>
#play {
  mask: url(/svg/play.svg);

  @apply bg-gray-body;
  width: 14px;
  height: 14px;
}

#btn:hover #play {
  @apply bg-white;
}
</style>
