<template>
  <div class="min-h-screen">
    <div class="px-6 pt-6 grid grid-cols-3">
      <div class="flex flex-row items-center gap-x-4">
        <img class="icon-header" src="/svg/logo.svg">
        <h2>Sharepage</h2>
      </div>
      <div class="flex flex-row items-center gap-x-4 mx-auto">
        <NuxtLink to="https://www.sharepage.io">
          <h3 class="gray">LEARN MORE</h3>
        </NuxtLink>
      </div>
      <div class="flex flex-row items-center justify-end gap-x-3">
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
