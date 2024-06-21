<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-6">
      <h1>Settings</h1>
      <div class="flex-grow" />
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
        <div class="subtext">Internal Only</div>
      </div>
      <UDropdown :items="settingsMenu">
        <UIcon
          class="-ml-4"
          name="i-heroicons-ellipsis-vertical" />
      </UDropdown>
    </div>
    <div class="page-area">
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="postcss">
.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
  overflow: hidden;
}
</style>