<template>
  <div>This shouldn't be seen!</div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'

const route = useRoute()
const shortcode = route.params.shortcode
const name = route.params.name

const store = useSharepagesStore()
const sharepage = await store.getSharepageByShortcode({ shortcode })

if (sharepage) {
  await navigateTo(`/${sharepage.id}?sent-to=${name}`, { redirectCode: 301 })
} else {
  // this should send them somewhere meaningful based on role
  await navigateTo('/')
}
</script>
