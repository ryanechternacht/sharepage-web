<template>
  <div class="h-[5rem] w-full flex flex-row items-center gap-8 px-8 border-b border-gray-200">
    <NuxtLink to="/" class="flex-shrink-0">
      <img src="/svg/logo.svg" class="icon-header">
    </NuxtLink>
    <template v-if="isSeller">
      <template v-if="!collapseHeader">
        <NuxtLink to="/feed" 
          class="link"
          :class="{ 'router-link-active': activeLink === 'feed' }">
          <UIcon class="icon-menu" name="i-heroicons-signal" />
          <span>Feed</span>
        </NuxtLink>
        <NuxtLink to="/sharepages" 
          class="link"
          :class="{ 'router-link-active': activeLink === 'sharepages' }">
          <UIcon class="icon-menu" name="i-heroicons-document" />
          <span>Sharepages</span>
        </NuxtLink>
        <NuxtLink to="/campaigns"
          class="link"
          :class="{ 'router-link-active': activeLink === 'campaigns' }">
          <UIcon class="icon-menu" name="i-heroicons-paper-airplane" />
          <span>Campaigns</span>
          <UBadge
            variant="outline" 
            class="beta-badge"
            size="xs">Beta</UBadge>
        </NuxtLink>
      </template>

    </template>

    <div class="flex-grow" />

    <slot name="action-button" />

    <div class="flex-shrink-0">
      <UserAvatar v-if="user" :user="user" size="large" class="flex-shrink-0" />
      <UButton v-else icon="i-heroicons-arrow-right-end-on-rectangle"
        variant="outline"
        @click="goToLogin">
        Login
      </UButton>
    </div>

    <div v-if="isSeller && collapseHeader">
      <UButton variant="ghost"
        icon="i-heroicons-bars-3" 
        @click="openMenu = true" />

      <USlideover v-model="openMenu">
        <UCard class="h-full">
          <template #header>
            <div class="flex flex-row items-center gap-2"> 
              <img src="/svg/logo.svg" class="icon-header">
              <h2>Sharepage</h2>
            </div>
          </template>

          <div class="flex flex-col gap-8">
            <NuxtLink to="/feed" 
              class="link"
              :class="{ 'router-link-active': activeLink === 'feed' }">
              <UIcon class="icon-menu" name="i-heroicons-signal" />
              <span>Feed</span>
            </NuxtLink>
            <NuxtLink to="/sharepages" 
              class="link"
              :class="{ 'router-link-active': activeLink === 'sharepages' }">
              <UIcon class="icon-menu" name="i-heroicons-document" />
              <span>Sharepages</span>
            </NuxtLink>
            <NuxtLink to="/campaigns"
              class="link"
              :class="{ 'router-link-active': activeLink === 'campaigns' }">
              <UIcon class="icon-menu" name="i-heroicons-paper-airplane" />
              <span>Campaigns</span>
              <UBadge
                variant="outline" 
                class="beta-badge"
                size="xs">Beta</UBadge>
            </NuxtLink>
          </div>
        </UCard>
      </USlideover>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const props = defineProps({ activeLink: String })

const usersStore = useUsersStore()
const {getMeCached, isUserSeller } = storeToRefs(usersStore)

const [user, isSeller] = await Promise.all([
  getMeCached.value(),
  isUserSeller.value(),
])

async function goToLogin () {
  await navigateTo('/login')
}

const viewport = useViewport()
const collapseHeader = ref(false)

if (viewport.isLessThan('tablet')) { 
  collapseHeader.value = true
}

watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  collapseHeader.value = !!viewport.isLessThan('tablet')
})

const openMenu = ref(false)
</script>

<style lang="postcss" scoped>
.link {
  @apply flex flex-row items-center gap-1;

  *, :deep(*) {
    @apply text-gray-500;
  }

  &.router-link-active {
    @apply p-2 -m-2 bg-gray-200 rounded-md;

    *, :deep(*) {
      @apply text-blue-500;
    }

    .beta-badge {
      @apply !text-white bg-blue-500
    }
  }

  .beta-badge {
    @apply !text-blue-500
  }
}
</style>