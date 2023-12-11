<template>
  <div class="page-layout">
    <div class="page-top">
      <TopNav class="col-span-2"/>
      <div class="mt-8 flex flex-row items-center justify-center gap-2">
        <!-- <img :src="buyersphere.buyerLogo" class="h-[1.25rem]"> -->
        <!-- <h3>{{ buyersphere.buyer }}</h3> -->
      </div>
      <div class="mt-8 mb-10 flex flex-row items-center justify-center gap-1 leading-none">
        <h1>My <!-- TODO this could be "john's"--></h1> 
        <h1 class="bg-purple-secondary text-white rounded-md px-1 py-[1px]">
          {{ mainSection.replace('-', ' ') }}
        </h1>
      </div>
    </div>

    <div class="[grid-area:right-header]">
      right-header
    </div>

    <div class="[grid-area:right]">
      right-sidebar
    </div>

    <!-- These return the left, center, left-header, and center-header sections -->
    <DashboardActivities v-if="mainSection === 'activities'" />
    <DashboardAccounts v-if="mainSection === 'accounts'" />
    <DashboardOpportunities v-if="mainSection === 'opportunities'" />

    <div class="[grid-area:footer] h-20" />
  </div>
</template>

<script setup>
// TODO which is the default page?

const route = useRoute()

const mainSection = computed(
  () => route.params.section ? route.params.section : 'activities')
</script>

<style lang="postcss" scoped>
.page-layout {
  @apply grid gap-y-4;
  grid-template-rows: auto 1fr;
  grid-template-columns: 300px 1fr 300px;
  grid-template-areas:
    "top         top           top"
    "left-header center-header right-header"
    "left        center        right"
    "footer      footer        footer";
}

.page-top {
  @apply bg-purple-background px-10 py-6;
  grid-area: top;

  &.grayscale-top {
    @apply bg-gray-border;
  }
}
</style>