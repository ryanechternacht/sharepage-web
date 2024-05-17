import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  const usersStore = useUsersStore()
  const { isUserSeller } = storeToRefs(usersStore)

  const [isSeller] = await Promise.all([
    isUserSeller.value(),
  ])
  
  if (!isSeller) {
    return navigateTo('/login')
  }
})
