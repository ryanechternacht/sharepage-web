<template>
  <div>
    <TopNav active-link="campaigns">
      <template #action-button>
        <UButton
          icon="i-heroicons-arrow-down-on-square-stack"
          :to="downloadListUrl">
          Download Campaign Links
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div class="mb-2 flex flex-row justify-between items-center">
        <h1>{{ campaign.title }}</h1>
        <UButton icon="i-heroicons-cog-6-tooth"
          variant="ghost"
          color="gray"
          :to="`/campaigns/${campaign.uuid}/setup`" />
      </div>

      <h2>Sharepages</h2>
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

const { makeInternalSwaypageLink, makeCampaignDownloadLink } = useSwaypageLinks()

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

const downloadListUrl = computed(() => {
  const { apiBaseUrl } = useNuxtApp()
  return makeCampaignDownloadLink(apiBaseUrl, campaign)
})
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
