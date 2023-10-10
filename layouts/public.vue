<template>
  <div class="min-h-screen">
    <div class="px-6 pt-6 flex flex-row justify-between items-center">
      <div class="flex flex-row items-center gap-x-1">
        <img src="/logo.svg">
        <h3>Buyersphere</h3>
      </div>
      <div class="flex flex-row items-center gap-x-4">
      </div>
      <div class="flex flex-row items-center gap-x-3">
        <!-- TODO add these login options back if we use this for more than login -->
        <!-- <NuxtLink to="/login" class="gray">LOG IN</NuxtLink> -->
        <!-- <NuxtLink to="/login" class="button w-16">JOIN</NuxtLink> -->
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
  @apply p-2 rounded-md bg-teal-primary body text-center;
  @apply font-bold text-white;
}
</style>

