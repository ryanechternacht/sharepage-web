<template>
  <BsButton :color="color" :hover-color="hoverColor"
    v-tooltip="'Copy to Clipboard'"
    @click="copyToClipboard">
    <template v-if="recentlyClicked">
      <div v-if="showText"
        class="mr-2 body-header text-white">
        Copied
      </div> 
      <CheckCircleIcon />
    </template>
    <template v-else>
      <div v-if="showText"
        class="mr-2 body-header text-white">
        Share
      </div> 
      <ShareIcon />
    </template>
  </BsButton>
</template>

<script setup>
import { useBuyerActivityStore } from '@/stores/buyer-activity';

const store = useBuyerActivityStore()

const props = defineProps({ 
  color: String,
  hoverColor: String,
  showText: { type: Boolean, default: true },
  buyersphereId: { type: Number, required: true },
  recipient: { type: String }
})

async function copyToClipboard() {
  clearTimeout(lastTimeout.value)

  const url = new URL(window.location.href)
  if (props.recipient) {
    url.search = `sent-to=${props.recipient}`
  }
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(url.href)
  } else {
    console.log(`can't find navigator, but would copy ${url.href}`)
  }
  recentlyClicked.value = true
  lastTimeout.value = setTimeout(() => recentlyClicked.value = false, 3000)

  store.captureBuyerActivity({ 
    activity: "click-share",
    buyersphereId: props.buyersphereId,
  })
}

const recentlyClicked = ref(false)
const lastTimeout = ref(null)
</script>

<style lang="postcss">
.v-popper__inner * {
  @apply text-white tag;
}
</style>