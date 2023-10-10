<template>
  <div class="sticky">
      <div class="flex flex-row items-center p-8 h-12 gap-x-4">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img src="/logo.svg">
          <h3>Buyersphere</h3>
        </NuxtLink>
        <NuxtLink class="" to="/">
          <h4>Dashboard</h4>
        </NuxtLink>
        <NuxtLink class="" to="/setup">
          <h4>Setup</h4>
        </NuxtLink>

        <div class="flex-grow" />

        <div class="flex flex-row-reverse items-center gap-x-2 min-w-[200px]">
          <UserAvatar :user="user" size="large" />
          <span>{{ user.firstName ? user.firstName + ' ' + user.lastName : user.email }}</span>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const user = await getMeCached.value()
</script>

<style lang="postcss" scoped>
</style>