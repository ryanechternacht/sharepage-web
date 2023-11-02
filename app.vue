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

useHead({ 
  link: [{
    rel: "icon",
    type: "image/png",
    href: "https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F6fe24110aa9d6320a1c004e55c941875.cdn.bubble.io%2Ff1697223014516x964641720147776600%2FFrame%25202.png?w=128&h=&auto=compress&dpr=1&fit=max",
  }]
})
</script>

<style lang="postcss">
</style>