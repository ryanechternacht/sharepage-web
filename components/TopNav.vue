<template>
  <div class="sticky">
      <div class="flex flex-row items-center gap-6">
        <NuxtLink to="/" class="link">
          <img src="/svg/logo-gradient.svg">
          <span>Home</span>
        </NuxtLink>
        <template v-if="user.buyersphereRole === 'admin'">
          <!-- TOOD point these to the correct routes and style them when active -->
          <NuxtLink to="/dashboard" class="link">
            <img src="/svg/inbox.svg">
            <span>Activities</span>
          </NuxtLink>
          <NuxtLink to="/dashboard" class="link">
            <img src="/svg/target.svg">
           <span>Accounts</span>
          </NuxtLink>
          <NuxtLink to="/dashboard" class="link">
            <img src="/svg/dollar-sign.svg">
            <span>Opportunities</span>
          </NuxtLink>
        </template>

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

const { featureFlags } = useAppConfig()
</script>

<style lang="postcss" scoped>
.link {
  @apply flex flex-row items-center gap-1;
}
</style>