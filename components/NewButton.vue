<template>
  <BsButton id="btn" :color="color" hover-color="blue">
    <div v-if="showText"
      class="mr-2 body-header">{{ text }}</div>
    <div id="new-thing" />
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
#new-thing {
  mask: url(/svg/new-thing.svg);

  @apply bg-gray-body;
  width: 14px;
  height: 14px;
}

#btn:hover #new-thing {
  @apply bg-white;
}
</style>
