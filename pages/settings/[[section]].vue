<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="[grid-area:top] page-top bg-gray-hover">
        <h1>{{ startCase(mainSection) }} Settings</h1>
      </div>

      <!-- These return the left, center, left-header, and center-header sections -->
      <SettingsPersonal v-if="mainSection === 'personal'" />
      <SettingsAdmin v-else-if="mainSection === 'admin'" />
      <SettingsGuideTemplate v-else-if="mainSection === 'guide-template'" />
      <SettingsTimelineTemplate v-else-if="mainSection === 'timeline-template'" />
      <SettingsAssetsTemplate v-else-if="mainSection === 'assets-template'" />
      <SettingsTimelineTemplateOld v-else-if="mainSection === 'timeline-template-old'" />

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { startCase } = lodash_pkg;

const route = useRoute()
const mainSection = computed(() => route.params.section || 'personal')
// TODO rewrite route to /personal

</script>

<style lang="postcss" scoped>
</style>