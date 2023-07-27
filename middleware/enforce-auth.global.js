import { useUserStore  } from '@/stores/user';
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // if (to.path === '/test') return;

  // if (to.path != '/login') {
  //   const store = useUserStore()
  //   const { getUserCached } = storeToRefs(store)
  //   const user = await getUserCached.value()
    
  //   if (!user) {
  //     return navigateTo('/login')
  //   }
  // }
})