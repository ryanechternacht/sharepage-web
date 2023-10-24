<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ModalsContainer />
  </div>
</template>

<script setup>
import { ModalsContainer } from 'vue-final-modal'
import { useUsersStore  } from '@/stores/users'
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
</script>

<style lang="postcss">
</style>