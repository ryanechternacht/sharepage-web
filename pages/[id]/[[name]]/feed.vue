<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-6">
      <h1>Feed</h1>
      <div class="flex-grow" />
        <!-- TODO implement -->
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <LockIcon class="text-orange-neutral icon-menu" />
        <div class="subtext">Internal Only</div>
      </div>
      <dropdown-menu
        direction="right"
        :overlay="false"
        with-dropdown-closer
        @opened="isDropdownOpen = true"
        @closed="isDropdownOpen = false">
        <template #trigger>
          <MoreVerticalIcon />
        </template>
        <template #body>
          <div class="dropdown-menu">
            <div class="dropdown-item"
              dropdown-closer
              @click="openPageSettingsModal()">Edit Page Settings</div>
            <div class="dropdown-item"
              dropdown-closer
              @click="openSwaypageSettingsModal()">Edit SwayPage Settings</div>
          </div>
        </template>
      </dropdown-menu>
    </div>
    <div class="page-area">
      feed
    </div>
  </div>     
</template>

<script setup>


definePageMeta({
  name: 'feed',
  layout: 'swaypage',
  // TODO middleware
})


</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-border-dark rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
}

</style>
