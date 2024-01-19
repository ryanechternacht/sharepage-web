import { useUsersStore  } from '@/stores/users';
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (to.path === '/test') return;

  if (to.path != '/login') {
    const usersStore = useUsersStore()
    const { getMeCached } = storeToRefs(usersStore)

    const organizationStore = useOrganizationStore()
    const { getOrganizationCached } = storeToRefs(organizationStore)

    const [me, organization] = await Promise.all([
      getMeCached.value(),
      getOrganizationCached.value(),
    ])
    
    if (!me || !organization) {
      return navigateTo('/login')
    }
  }
})
