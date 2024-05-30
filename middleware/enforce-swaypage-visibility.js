import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia' 

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
