import { useUsersStore  } from '@/stores/users';
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // if (to.path === '/test') return;

  // if (to.path != '/login') {
  //   const store = useUsersStore()
  //   const { getMeCached } = storeToRefs(store)
  //   const user = await getMeCached.value()
    
  //   if (!user) {
  //     return navigateTo('/login')
  //   }
  // }
})
