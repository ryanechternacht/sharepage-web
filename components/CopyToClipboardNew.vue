<template>
  <SpButton :color="color" :hover-color="hoverColor"
    v-tooltip="'Copy to Clipboard'"
    @click="copyToClipboard">
    <template #icon>
      <CheckCircleIcon v-if="recentlyClicked"
        class="icon-menu text-white" />
      <Link2Icon v-else
        class="icon-menu text-white" />
    </template>
    <div class="text-white">
      {{ recentlyClicked ? "Copied" : "Share" }}
    </div>
  </SpButton>
</template>

<script setup>
import { useBuyerActivityStore } from '@/stores/buyer-activity';

const store = useBuyerActivityStore()

const props = defineProps({ 
  color: String,
  hoverColor: String,
  url: { type: String, required: true },
  swaypageId: { type: Number, required: true },
})

const { makeExternalSwaypageLink, makePersonalizedExternalSwaypageLink } = useSwaypageLinks()

async function copyToClipboard() {
  clearTimeout(lastTimeout.value)

  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(props.url)
  } else {
    console.log(`can't find navigator, but would copy ${props.url}`)
  }
  
  recentlyClicked.value = true
  lastTimeout.value = setTimeout(() => recentlyClicked.value = false, 3000)

  store.captureBuyerActivity({ 
    activity: "click-share",
    buyersphereId: props.swaypageId,
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