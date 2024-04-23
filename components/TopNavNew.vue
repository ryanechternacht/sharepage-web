<template>
  <div class="h-[5rem] w-full flex flex-row items-center gap-8 px-8 border-b border-gray-border-dark">
    <NuxtLink to="/" class="mr-4">
      <img src="/svg/logo-blue.svg" class="icon-header">
    </NuxtLink>
    <template v-if="isSeller">
      <!-- TOOD point this to the correct route -->
      <NuxtLink to="/dashboard/insights" class="link">
        <RadioIcon class="icon-menu" />
        <span>Feed</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/accounts" class="link">
        <FileIcon class="icon-menu" />
        <span>Swaypages</span>
      </NuxtLink>
      <!-- TOOD point this to the correct route -->
      <!-- <NuxtLink to="/swaypage-demo" class="link">
        <ZapIcon class="icon-menu" />
        <span>Leads</span>
      </NuxtLink> -->
      <!-- TOOD point this to the correct route -->
      <!-- <NuxtLink to="" class="link">
        <SendIcon class="icon-menu" />
        <span>Campaigns</span>
      </NuxtLink> -->
      <NuxtLink to="/dashboard/activities" class="link">
        <CheckCircleIcon class="icon-menu" />
        <span>Activities</span>
      </NuxtLink>
    </template>

    <div class="flex-grow" />

    <slot name="action-button" />

    <div v-if="user">
      <UserAvatar :user="user" size="large" />
    </div>
    <div v-else>
      <SpButton @click="goToLogin">
        <template #icon>
          <LogInIcon class="icon-menu" />
        </template>
        Login
      </SpButton>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const {getMeCached, isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [user, hasUser, isSeller] = await Promise.all([
  getMeCached.value(),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

async function goToLogin () {
  await navigateTo('/login')
}
</script>

<style lang="postcss" scoped>
.link {
  @apply flex flex-row items-center gap-1;

  *, :deep(*) {
    @apply text-gray-medium;
  }

  &.router-link-active {
    @apply p-2 -mx-2 bg-gray-background rounded-md;

    *, :deep(*) {
      @apply text-blue-brand;
    }
  }
}
</style>