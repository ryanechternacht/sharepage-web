<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div class="w-full flex flex-row justify-between">
        <h1>{{ campaign.title }}</h1>
        <UTabs :items="tabs" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia';

const route = useRoute()
const campaignId = route.params.id

const campaignsStore = useCampaignsStore()
const { getCampaignByIdCached } = storeToRefs(campaignsStore)

const [campaign] = await Promise.all([
  getCampaignByIdCached.value(campaignId)
])

const tabs = [{
  label: 'Setup',
}, {
  label: 'Variables',
  disabled: true,
}, {
  label: 'AI Prompts',
  disabled: true,
}]
</script>

<style lang="postcss" scoped>
</style>
