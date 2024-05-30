<template>
  <div class="min-h-screen">
    <div class="px-6 pt-6 grid grid-cols-3">
      <div class="flex flex-row items-center gap-x-1">
        <img src="/svg/logo.svg">
        <h3>Swaypage</h3>
      </div>
      <div class="flex flex-row items-center gap-x-4 mx-auto">
        <NuxtLink to="https://www.swaypage.io">
          <h3 class="gray">LEARN MORE</h3>
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center justify-end gap-x-3">
        <NuxtLink to="/login" class="gray">LOG IN</NuxtLink>
        <UButton to="/signup">SIGNUP</UButton>
      </div>
    </div>
    <div class="text-center mt-[100px] mb-[100px]">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
</style>
