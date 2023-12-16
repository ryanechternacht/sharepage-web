<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="page-top">
        <div class="mt-8 flex flex-row items-center justify-center gap-2">
        </div>
        <div class="mt-8 mb-10 flex flex-row items-center justify-center gap-1 leading-none">
          <h1>My <!-- TODO this could be "john's"--></h1> 
          <h1 class="bg-purple-secondary text-white rounded-md px-1 py-[1px]">
            {{ mainSection.replace('-', ' ') }}
          </h1>
        </div>
      </div>

      <!-- These return the left, center, left-header, and center-header sections -->
      <SettingsPersonal v-if="mainSection === 'personal'" />
      <SettingsGlobal v-else-if="mainSection === 'global'" />
      <SettingsTeam v-else-if="mainSection === 'team'" />
      <SettingsActivityPlan v-else-if="mainSection === 'activity-plan'" />
      <SettingsDiscoveryGuide v-else-if="mainSection === 'discovery-guide'" />
      <SettingsResources v-else-if="mainSection === 'resources'" />

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>

const route = useRoute()
const mainSection = computed(() => route.params.section || 'personal')
// TODO rewrite route to /personal

</script>

<style lang="postcss" scoped>
.page-layout {
  @apply grid gap-y-4;
  grid-template-rows: auto 1fr;
  grid-template-columns: 300px 1fr;
  grid-template-areas:
    "top    top"
    "left   center"
    "footer footer";
}

.page-top {
  @apply bg-gray-hover px-10;
  grid-area: top;
}
</style>