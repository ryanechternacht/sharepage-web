<template>
  <div>This shouldn't be seen!</div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'

const route = useRoute()
const shortcode = route.params.shortcode

const store = useSharepagesStore()
const swaypage = await store.getSharepageByShortcode({ shortcode })

if (swaypage) {
  await navigateTo(`/${swaypage.id}`, { redirectCode: 301 })
} else {
  // this should send them somewhere meaningful based on role
  await navigateTo('/') 
}
</script>
