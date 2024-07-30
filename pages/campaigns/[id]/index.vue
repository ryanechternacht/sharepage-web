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
      <div class="mt-2 sharepage-grid">
        <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

        <NuxtLink class="contents cursor-pointer group" v-for="sharepage in sharepages"
          :to="makeVirtualSharepageLink(sharepage.shortcode, `${sharepage.pageData.firstName}-${sharepage.pageData.lastName}`)">
          <div class="cell body">
            <Logo :src="makeClearbitLogo(sharepage.pageData.domain)" class="icon-menu" />
            {{ sharepage.pageData.accountName }}
          </div>
          <div class="cell">
            <!-- <SharepagePriorityTag :priority="sharepage.priority" /> -->
          </div>
          <div class="cell">
            <!-- <SharepageStatusTag
              :last-activity-date="sharepage.mostRecentBuyerActivity"
              :isOnHold="sharepage.status === 'on-hold'" /> -->
          </div>
          <div class="cell subtext">{{ prettyFormatDate(sharepage.updatedAt )}}</div>
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
const [campaign, { data: sharepages }] = await Promise.all([
  getCampaignByIdCached.value(campaignId),
  await apiFetch(`/v0.1/campaign/${campaignId}/sharepages`)
])

if (!campaign.isPublished) {
  await navigateTo(`/campaigns/${campaign.uuid}/setup`, { replace: true })
}

const { makeVirtualSharepageLink, makeCampaignDownloadLink } = useSharepageLinks()

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

const downloadListUrl = computed(() => {
  const { apiBaseUrl } = useNuxtApp()
  return makeCampaignDownloadLink(apiBaseUrl, campaign)
})

const { makeClearbitLogo } = useLogo();
</script>

<style lang="postcss" scoped>
.sharepage-grid {
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
