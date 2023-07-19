<template>
  <div>
    <div class="bg-purple-lightest min-h-screen">
      <div class="sticky">
        <div class="flex flex-row items-center p-8 h-12 justify-between">
          <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
            <img src="/logo.svg">
            <h3>Buyersphere</h3>
          </NuxtLink>
          <div class="flex flex-row items-center gap-x-2">
            <span>{{ user.name || user.email }}</span>
            👤
          </div>
        </div>
      </div>
      <div class="px-8 pb-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore  } from '@/stores/user';
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { getUserCached } = storeToRefs(store)
const user = await getUserCached.value()
</script>

<style lang="postcss" scoped>
</style>