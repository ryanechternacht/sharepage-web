<template>
  <div>This shouldn't be seen!</div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'

const route = useRoute()
const shortcode = route.params.shortcode

const store = useSwaypagesStore()
const swaypage = await store.getSwaypageByShortcode({ shortcode })

if (swaypage) {
  await navigateTo(`/${swaypage.id}`)
} else {
  // this should send them somewhere meaningful based on role
  await navigateTo('/') 
}
</script>
