import { useUsersStore  } from '@/stores/users';
import { useOrganizationStore } from '@/stores/organization'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (to.path === '/test') {
    return;
  } else if (to.matched[0]?.name === 'buyersphere') {
    const buyersphereStore = useBuyerspheresStore()
    const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

    const buyersphere = await getBuyersphereByIdCached.value(to.params.id)

    if (!buyersphere) {
      return navigateTo('/login')
    }
  } else if (to.path != '/login') {
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
  // else it's login and it's fine
})
