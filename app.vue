<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UModals />

    <!-- <UModal v-model="showModal" prevent-close
      :ui="{ overlay: { background: 'bg-gray-200 dark:bg-gray-800'} }">
      <UCard>
        <template #header>
          <div class="flex flex-col items-center gap-4">
            <Logo src="/svg/logo-blue.svg" class="icon-menu max-h-[3rem] max-w-[3rem]" />
            <h1 class="text-center">
              Swaypage is designed for larger screens.
            </h1>
          </div>
        </template>

        <h2 class="text-center">Please try again at your computer</h2>
      </UCard>
    </UModal> -->
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const user = await getMeCached.value()

const { identify } = useHeap()

if (process.client && user) {
  identify(user.id, {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    organizationId: user.organizationId,
    role: user.buyersphereRole    
  })
}

useHead({ 
  link: [{
    rel: "icon",
    type: "image/png",
    href: "/svg/logo-blue.svg",
  }]
})

// const viewport = useViewport()
// const showModal = ref(false)

// watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
//   if (viewport.isLessThan('tablet')) {
//     showModal.value = true
//   } else {
//     showModal.value = false
//   }
// })
</script>

<style lang="postcss" scoped>
</style>