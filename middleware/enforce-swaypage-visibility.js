import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  const swaypageStore = useSharepagesStore()
  const { getSharepageByIdCached } = storeToRefs(swaypageStore)

  const [swaypage] = await Promise.all([
    getSharepageByIdCached.value(to.params.id),
  ])

  if (!swaypage) {
    return navigateTo('/login')
  }
})
