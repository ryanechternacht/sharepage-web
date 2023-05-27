<template>
  <div class="flex flex-col">
    <div class="flex flex-row gap-2">
      <img :src="partner.logo" class="h-8 w-8">
      <div class="text-3xl">{{ partner.name }}</div>
      <div class="flex-grow" />

      <span>Lead Accepted</span>
    </div>
    <div class="flex flex-row gap-2">
      <PButton 
        @click="currentTab = 'joint-value'"
        :class="{selected: currentTab === 'joint-value'}">
        🪐 Joint Value
      </PButton>
      <PButton 
        @click="currentTab = 'partner-value'"
        :class="{selected: currentTab === 'partner-value'}">
        🚀 Partner Value
      </PButton>
      <PButton 
        @click="currentTab = 'resources'"
        :class="{selected: currentTab === 'resources'}">
        📓 Resources
      </PButton>
    </div>
    
    <PartnershipJointValue v-if="currentTab === 'joint-value'" :joint-value="partner.jointValue"/>
    <PartnershipPartnerValue v-else-if="currentTab === 'partner-value'" />
    <PartnershipResources v-else-if="currentTab === 'resources'" />
  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object
})

const currentTab = ref('joint-value')
</script>

<script>
export default {
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
</style>