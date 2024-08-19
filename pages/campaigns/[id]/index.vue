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
      <div class="w-full flex flex-row justify-end gap-2">
        <UInput v-model="searchTerm"
          icon="i-heroicons-magnifying-glass"
          class="my-2"
          placeholder="Account" />
      </div>
      <UTable :rows :columns @select="goToSharepage"
        :empty-state="{ icon: null, label: 'No sharepages match the search.' }">
        <template #pageData.accountName-data="{ row }">
          <div class="flex flex-row items-center gap-2">
            <Logo :src="makeClearbitLogo(row.pageData.domain)" class="icon-menu" />
            {{ row.pageData.accountName }}
          </div>
        </template>

        <template #mostRecentBuyerActivity-data="{ row }">
          <SharepageStatusTag
            :last-activity-date="row.mostRecentBuyerActivity"
            :isOnHold="row.status === 'on-hold'" />
        </template>

        <template #updatedAt-data="{ row }">
          {{ prettyFormatDate(row.updatedAt )}}
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup>
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia';
import lodash_pkg from 'lodash';
const { filter } = lodash_pkg;

const route = useRoute()
const campaignId = route.params.id

const campaignsStore = useCampaignsStore()
const { getCampaignByIdCached } = storeToRefs(campaignsStore)

const { apiFetch } = useNuxtApp()
const [campaign, { data: sharepages }] = await Promise.all([
  getCampaignByIdCached.value(campaignId),
  await apiFetch(`/v0.1/campaign/${campaignId}/swaypages`)
])

const searchTerm = ref('')

const rows = computed(() => 
  filter(sharepages.value, c => c.pageData.accountName.toLowerCase().includes(searchTerm.value.toLowerCase())))


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

async function goToSharepage (sp) {
  await navigateTo(makeVirtualSharepageLink(sp.shortcode, `${sp.pageData.firstName}-${sp.pageData.lastName}`))
}

const columns = [{
  label: 'Account',
  key: 'pageData.accountName',
  sortable: true,
}, {
  label: 'Status',
  key: 'mostRecentBuyerActivity',
}, {
  label: 'Modified',
  key: 'updatedAt',
  sortable: true,
}]
</script>

<style lang="postcss" scoped>
</style>
