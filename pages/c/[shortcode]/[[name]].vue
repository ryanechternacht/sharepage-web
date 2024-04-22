<template>
  <div>This shouldn't be seen!</div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'

console.log('company link')

const route = useRoute()
const shortcode = route.params.shortcode

const store = useSwaypagesStore()
const swaypage = await store.getSwaypageByShortcode({ shortcode })

console.log('swaypage', swaypage)

if (swaypage) {
  await navigateTo(`/${swaypage.id}`, { redirectCode: 301 })
} else {
  // this should send them somewhere meaningful based on role
  await navigateTo('/') 
}
</script>
