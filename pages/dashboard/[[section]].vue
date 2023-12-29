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
      <DashboardActivities v-if="mainSection === 'activities'" />
      <DashboardAccounts v-if="mainSection === 'accounts'" />
      <DashboardInsights v-if="mainSection === 'insights'" />

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
// TODO which is the default page?

const route = useRoute()

const mainSection = computed(
  () => route.params.section ? route.params.section : 'activities')
</script>

<style lang="postcss" scoped>
.page-top {
  @apply bg-purple-background px-10;
  grid-area: top;

  &.grayscale-top {
    @apply bg-gray-border;
  }
}
</style>