<template>
  <div class="flex flex-row items-center gap-6 w-full px-10 py-6">
    <NuxtLink to="/" class="link">
      <img src="/svg/logo.svg" class="h-[1rem] w-[1rem]">
      <span>Home</span>
    </NuxtLink>
    <template v-if="user?.buyersphereRole === 'admin'">
      <!-- TOOD point these to the correct routes and style them when active -->
      <NuxtLink to="/dashboard/activities" class="link">
        <InboxIcon class="body" />
        <span>Activities</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/accounts" class="link">
        <CrosshairIcon class="body" />
        <span>Accounts</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/insights" class="link">
        <ZapIcon class="body" />
        <span>Insights</span>
      </NuxtLink>
    </template>

    <div class="flex-grow" />

    <div v-if="user"
      class="flex flex-row-reverse items-center gap-x-2 min-w-[200px]">
      <UserAvatar :user="user" size="large" />
      <span>{{ user.firstName ? user.firstName + ' ' + user.lastName : user.email }}</span>
      <NuxtLink v-if="user?.buyersphereRole === 'admin'"
        to="/settings"
        class="mr-2 hover:font-bold">
        <!-- TODO should probably be an icon -->
        Settings
      </NuxtLink>
    </div>
    <div v-else>
      <BsButton color="blue" hover-color="blue"
        @click="goToLogin">Login</BsButton>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { hasUser, getMeCached } = storeToRefs(usersStore)

const user = await getMeCached.value()

async function goToLogin () {
  await navigateTo('/login')
}
</script>

<style lang="postcss" scoped>
.link {
  @apply flex flex-row items-center gap-1 w-[5rem];

  &:hover * {
    @apply font-bold;
  }
}
</style>