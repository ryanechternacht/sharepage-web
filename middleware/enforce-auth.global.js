import { useUsersStore } from '@/stores/users';
import { useOrganizationStore } from '@/stores/organization'
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia' 

export default defineNuxtRouteMiddleware(async (to, _) => {
  if (to.path === '/test' || to.path === '/page-rework') {
    return;
  } if (to.path.startsWith('/u/') || to.path.startsWith('/c/')) { 
    return; // these will redirect and have permissions handled later
  } else if (to.matched[0]?.name === 'swaypage') {
    const buyersphereStore = useSwaypagesStore()
    const { getSwaypageByIdCached } = storeToRefs(buyersphereStore)

    const usersStore = useUsersStore()
    const { isUserSeller } = storeToRefs(usersStore)

    const [buyersphere, isSeller] = await Promise.all([
      getSwaypageByIdCached.value(to.params.id),
      isUserSeller.value(),
    ])

    if (!buyersphere) {
      return navigateTo('/login')
    } else if (!isSeller && to.params.page === 'insights') {
      // TODO this is a massive hack, and I need better client side routing/permissioning
      return navigateTo(`/${to.params.id}`)
    }
  } else if (!['/login', '/signup'].includes(to.path)) {
    // TODO a better way to do route permission 
    // (probably using definePageMeta)
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
