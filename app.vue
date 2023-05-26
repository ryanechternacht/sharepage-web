<template>
  <div>
    <div class="sticky bg-gray-200">
      <div class="flex flex-row items-center py-2 pl-2 h-12 gap-x-4">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img class="h-8" src="/partnorize-logo.jpeg" />
          <span class="ml-2 text-[#0500db] font-bold">Partnorize</span>
        </NuxtLink>

        <NuxtLink to="/partnerships">
          Partnerships
        </NuxtLink>

        <NuxtLink to="/leads">
          Leads
        </NuxtLink>

        <div class="flex-grow"></div>

        <div class="p-12 font-16">👤</div>
      </div>
    </div>

    <NuxtPage />
  </div>
</template>

<style lang="postcss">
.router-link-active {
  @apply border-b-2 border-[#0500db];
}

</style>