import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  const sharepageStore = useSharepagesStore()
  const { getSharepageByIdCached } = storeToRefs(sharepageStore)

  const [sharepage] = await Promise.all([
    getSharepageByIdCached.value(to.params.id),
  ])

  if (!sharepage) {
    return navigateTo('/login')
  }
})
