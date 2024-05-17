<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="[grid-area:top] page-top bg-blue-background">
        <h1>{{ capitalize(mainSection) }}</h1>
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
import lodash_pkg from 'lodash';
const { capitalize } = lodash_pkg;

const route = useRoute()

definePageMeta({
  middleware: ['dead-page'],
})

const mainSection = computed(
  () => route.params.section ? route.params.section : 'activities')
</script>

<style lang="postcss" scoped>
</style>