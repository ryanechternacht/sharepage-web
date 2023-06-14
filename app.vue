<template>
  <div class="full-page min-h-screen">
    <div class="sticky">
      <div class="flex flex-row items-center py-2 pl-2 h-12 gap-x-4">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img class="h-8 max-w-16" src="/partnorize-logo.jpeg" />
          <span class="ml-2 text-blue font-bold">Partnorize</span>
        </NuxtLink>

        <NuxtLink to="/leads">
          Leads
        </NuxtLink>

        <NuxtLink to="/partnerships">
          Partnerships
        </NuxtLink>

        <NuxtLink to="/dealroom">
          Deal Room
        </NuxtLink>

        <div class="flex-grow"></div>

        <div class="p-12 font-16">👤</div>
      </div>
    </div>

    <div class="p-8">
      <NuxtPage />
    </div>
  </div>
</template>

<style lang="postcss">
.router-link-active {
  @apply border-b-2 border-blue;
}

</style>