<template>
  <div>
    <TopNav />

    <div class="px-10 py-5">
      <div class="mb-2 flex flex-row justify-between items-center">
        <h1>{{ campaign.title }}</h1>
        <NuxtLink :to="`/campaigns/${campaign.uuid}/setup`">
          <UIcon class="w-[2rem] h-[2rem] icon-menu" 
            name="i-heroicons-cog-8-tooth" />
        </NuxtLink>
      </div>

      <h2>Swaypages</h2>
      <div class="mt-2 swaypage-grid">
        <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

        <NuxtLink class="contents cursor-pointer group" v-for="swaypage in swaypages"
          :to="makeInternalSwaypageLink(swaypage)">
          <div class="cell body">
            <Logo :src="swaypage.buyerLogo" class="icon-menu" />
            {{ swaypage.buyer }}
          </div>
          <div class="cell">
            <SwaypagePriorityTag :priority="swaypage.priority" />
          </div>
          <div class="cell">
            <SwaypageStatusTag
              :last-activity-date="swaypage.mostRecentBuyerActivity"
              :isOnHold="swaypage.status === 'on-hold'" />
          </div>
          <div class="cell subtext">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
        </NuxtLink>
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

const { apiFetch } = useNuxtApp()
const [campaign, { data: swaypages }] = await Promise.all([
  getCampaignByIdCached.value(campaignId),
  await apiFetch('/v0.1/buyerspheres', { 
    query: {
      'campaign-uuid': campaignId
    }
  }),
])

if (!campaign.isPublished) {
  await navigateTo(`/campaigns/${campaign.uuid}/setup`, { replace: true })
}

const { makeInternalSwaypageLink } = useSwaypageLinks()

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.swaypage-grid {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  grid-template-columns: repeat(4, 1fr);
}

.cell {
  @apply py-2 relative flex flex-row items-center gap-2;

  &::after {
    @apply absolute bg-gray-200 h-[1px] w-screen;
    content: '';
    inset-inline-start: -5rem;
    inset-block-start: 0;
  }
}
</style>
