<template>
  <div class="min-h-screen">
    <div class="px-6 pt-6 flex flex-row justify-between items-center">
      <div class="flex flex-row items-center gap-x-1">
        <img src="/logo.svg">
        <h3>Buyersphere</h3>
      </div>
      <div class="flex flex-row items-center gap-x-4">
        <h3 class="gray">HOME</h3>
        <h3 class="gray">HOW IT WORKS</h3>
        <h3 class="gray">PARTNER SEARCH</h3>
        <h3 class="gray">PRICING</h3>
      </div>
      <div class="flex flex-row items-center gap-x-3">
        <NuxtLink to="/login" class="gray">LOG IN</NuxtLink>
        <!-- TODO PButton rework -->
        <NuxtLink to="/login" class="button w-16">JOIN</NuxtLink>
      </div>
    </div>
    <!-- TODO get this height to center dynamically -->
    <div class="text-center mt-[200px]">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.button {
  @apply p-2 rounded-md bg-blue-jewel body text-center;
  @apply font-bold text-green-jewel;
}
</style>

