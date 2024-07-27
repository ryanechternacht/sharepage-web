<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UModals />
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
    href: "/svg/logo.svg",
  }]
})
</script>

<style lang="postcss" scoped>
</style>