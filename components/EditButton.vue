<template>
  <BsButton id="btn" :color="color" hover-color="blue">
    <div v-if="showText"
      class="tag mr-2">Edit</div> 
    <div id="pencil" />
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: false }
})
</script>

<style lang="postcss" scoped>
#pencil {
  mask: url(/svg/pencil.svg);

  @apply bg-gray-body;
  width: 14px;
  height: 14px;
}

#btn:hover #pencil {
  @apply bg-white;
}
</style>
