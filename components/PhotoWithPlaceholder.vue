<template>
  <div>
    <img v-show="imgLoaded" :src @load="imgLoaded = true" class="rounded-md">
    <!-- TODO blurhash? -->
    <!-- <Blurhash v-show="!imgLoaded && blurhash" :hash="blurhash" class="aspect-[4/3]" /> -->
    <div v-show="!imgLoaded" class="aspect-[4/3] bg-gray-300 rounded-md" />
  </div>
</template>

<script setup>
const props = defineProps({ 
  src: { type: String, required: true },
  blurhash: { type: String},
})

const imgLoaded = ref(false)

watch(() => props.src, () => imgLoaded.value = false)
</script>
