import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia' 

// TODO this whole page should be replaced with route middleware
// at the page level. Moving towards layouts + pages 
// (instead of pages + components) should make this much easier

export default defineNuxtRouteMiddleware(async (to, _) => {
  const swaypageStore = useSwaypagesStore()
  const { getSwaypageByIdCached } = storeToRefs(swaypageStore)

  const [swaypage] = await Promise.all([
    getSwaypageByIdCached.value(to.params.id),
  ])

  if (!swaypage) {
    return navigateTo('/login')
  }
})
