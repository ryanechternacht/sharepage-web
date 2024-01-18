<template>
  <div>This shouldn't be seen!</div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const { makeBuyersphereLink } = useBuyersphereLinks()

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const user = await getMeCached.value()

if (user.buyersphereRole === 'admin') {
  await navigateTo('/dashboard')
} else if (user.buyersphereRole === 'buyer') {
  const { apiFetch } = useNuxtApp()
  const { data } = await apiFetch('/v0.1/users/me/buyerspheres')
  // TODO what to do when there's no answer?
  await navigateTo(makeBuyersphereLink(data.value[0]))
}
</script>
