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
  swaypageShortcode: { type: String, required: true },
  companyName: { type: String },
  recipient: { type: String }
})

const { makeExternalSwaypageLink, makePersonalizedExternalSwaypageLink } = useSwaypageLinks()

async function copyToClipboard() {
  clearTimeout(lastTimeout.value)

  const path = props.recipient
    ? makePersonalizedExternalSwaypageLink(props.swaypageShortcode, props.recipient)
    : makeExternalSwaypageLink(props.swaypageShortcode, props.companyName)

  const u = useRequestURL()
  const urlBase =  u.protocol + '//' + u.host;

  const url = new URL(path, urlBase)

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
  /* ryan */
  @apply text-white;
  /* @apply text-white tag; */
}
</style>