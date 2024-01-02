<template>
  <BsButton :color="color"
    v-tooltip="'Copy to Clipboard'"
    @click="copyToClipboard">
    <template v-if="recentlyClicked">
      <div v-if="showText"
        class="mr-2 body-header">
        Copied
      </div> 
      <img src="/svg/checkmark--green.svg">
    </template>
    <template v-else>
      <div v-if="showText"
        class="mr-2 body-header">
        Share
      </div> 
      <img src="/svg/share.svg">
    </template>
  </BsButton>
</template>

<script setup>
const props = defineProps({ 
  color: String,
  showText: { type: Boolean, default: true }
})

async function copyToClipboard() {
  clearTimeout(lastTimeout.value)
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(window.location.href)
  } else {
    console.log(`can't find navigator, but would copy ${window.location.href}`)
  }
  recentlyClicked.value = true
  lastTimeout.value = setTimeout(() => recentlyClicked.value = false,
    3000)
}

const recentlyClicked = ref(false)
const lastTimeout = ref(null)
const showToolip = computed(() => recentlyClicked.value ? true : null)
</script>

<style lang="postcss">
.v-popper__inner * {
  @apply text-white tag;
}
</style>