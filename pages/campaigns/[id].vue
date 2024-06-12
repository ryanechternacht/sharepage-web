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
        <UTabs v-model="selectedTab" :items="tabs" />
      </div>

      <div v-if="selectedTab === 0">
        <!-- <div class="border border-gray-200 rounded-md flex flex-col">
          <div class="setup-section">
            <div class="number">1</div>
            <h2>Campaign Name</h2>
            <UInput v-model="templateName" />
          </div>
          <div class="divider" />
          <div class="setup-section">
            <div class="number">2</div>
            <h2>Campaign Template</h2>
            <USelectMenu
              v-model="selectedTemplate"
              class="w-[initial]"
              by="id"
              searchable
              option-attribute="buyer"
              placeholder="Search for a template"
              :search-attributes="['buyer']"
              :options="templateRooms">
            </USelectMenu>
          </div>
          <div class="divider" />
          <div class="setup-section">
            <div class="number">3</div>
            <h2>Campiagn Leads</h2>
            <UInput type="file"
              icon="i-heroicons-folder"
              @change="fileSelected" />
            <UButton
              icon="i-heroicons-arrow-down-tray"
              to="/swaypage-csv-template.csv"
              target="_blank">Download Template</UButton>
          </div>
        </div>

        <SubmitButton
          class="mt-8"
          icon="i-heroicons-plus"
          ready-text="Create Campaign"
          submitting-text="Creating Campaign"
          submitted-text="Campaign Created"
          error-text="Try Again"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" /> -->
      </div>

      <div v-if="selectedTab === 1">
        <div class="border border-gray-200 rounded-md variables-grid">
          <div class="row">
            <h2>Variable Name</h2>
            <h2>Field Description</h2>
            <h2>Samples</h2>
          </div>

          <div v-for="(row, index) in variablesTranposed"
            class="row">
            <div class="body">{{ variableRowNameMaker(index) }}</div>
            <div>
              <UInput v-model="campaign.headerRow[index]"
                icon="i-heroicons-tag"/></div>
            <div class="flex flex-col gap-2 subtext">
              <div v-for="r in row">{{ r }}</div>
            </div>
          </div>
        </div>

        <SubmitButton
          v-if="!campaign.columnsApproved"
          class="mt-8"
          icon="i-heroicons-plus"
          ready-text="Approve Variables"
          submitting-text="Approving Variables"
          submitted-text="Variables Approved"
          error-text="Try Again"
          :submissionState="columnsSubmissionState"
          @click="columnsSubmitFn" />
      </div>

      <div v-if="selectedTab === 1">
        <!-- <SubmitButton
          v-if="!campaign.columnsApproved"
          class="mt-8"
          icon="i-heroicons-plus"
          ready-text="Approve Variables"
          submitting-text="Approving Variables"
          submitted-text="Variables Approved"
          error-text="Try Again"
          :submissionState="columnsSubmissionState"
          @click="columnsSubmitFn" /> -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia';
import lodash_pkg from 'lodash';
const { zip } = lodash_pkg;

const route = useRoute()
const campaignId = route.params.id

const campaignsStore = useCampaignsStore()
const { getCampaignByIdCached } = storeToRefs(campaignsStore)

const [campaign] = await Promise.all([
  getCampaignByIdCached.value(campaignId)
])

const tabs = computed(() => [{
  label: 'Setup',
}, {
  label: 'Variables',
// }, {
//   label: 'AI Prompts',
//   disabled: !campaign.columnsApproved,
}, {
  label: 'Publish',
  disabled: !campaign.columnsApproved, // TODO change this to aiPromptsApproved
}])
const selectedTab = ref(1)

const variablesTranposed = zip.apply(null, campaign.sampleRows)

function variableRowNameMaker (rowNumber) {
  if (rowNumber === 0) {
    return 'account-name'
  } else if (rowNumber === 1) {
    return 'first-name'
  } else if (rowNumber === 2) {
    return 'last-name'
  } else if (rowNumber === 3) {
    return 'email'
  } else {
    return `field-${rowNumber}`
  }
}

const { 
  submissionState: columnsSubmissionState, 
  submitFn: columnsSubmitFn,
  error
} = useSubmit(async () => {
  await campaignsStore.updateCampaign({
    uuid: campaign.uuid,
    columnsApproved: true,
  })
})
</script>

<style lang="postcss" scoped>
.setup-section {
  @apply p-6 grid items-center gap-8;
  grid-template-columns: 
    minmax(auto, 3rem)
    minmax(auto, 12rem)
    minmax(10rem, 20rem)
    minmax(5rem, auto)
    1fr;
}

.number {
  @apply w-[1.5rem] h-[1.5rem] bg-blue-500 text-white rounded-sm
    flex flex-row items-center justify-center;
}

.divider {
  @apply border-b border-gray-200 w-full;
}

.variables-grid {
  @apply grid justify-center;
  grid-template-columns: repeat(3, minmax(auto, 1fr));

  .row {
    @apply contents;
    
    & > * {
      @apply py-2 px-8 border-b border-gray-200;
    }

    &:last-child > * {
      @apply border-b-0
    }
  }
}

</style>
