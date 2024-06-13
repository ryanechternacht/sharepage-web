<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton v-if="selectedTab === 0 && !campaign.isPublished"
          @click="selectedTab = 1">
          Review Variables
        </UButton>

        <SubmitButton
          v-if="selectedTab === 1 && !campaign.columnsApproved"
          icon="i-heroicons-check"
          ready-text="Approve Variables"
          submitting-text="Approving Variables"
          submitted-text="Variables Approved"
          error-text="Try Again"
          :submissionState="columnsSubmissionState"
          @click="columnsSubmitFn" />

        <SubmitButton
          v-if="selectedTab === 2 && !campaign.isPublished"
          color="green"
          icon="i-heroicons-document-check"
          ready-text="Publish"
          submitting-text="Publishing"
          submitted-text="Published!"
          error-text="Try Again"
          :submissionState="publishSubmissionState"
          @click="publishSubmitFn" />
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div class="w-full flex flex-row justify-between">
        <h1>{{ campaign.title }}</h1>
        <UTabs v-model="selectedTab" :items="tabs" />
      </div>

      <div v-if="selectedTab === 0">
        <div class="border border-gray-200 rounded-md flex flex-col">
          <div class="setup-section">
            <div class="number">1</div>
            <h2>Campaign Name</h2>
            <UInput v-model="title" />
          </div>
          <div class="divider" />
          <div class="setup-section">
            <div class="number">2</div>
            <h2>Campaign Template</h2>
            <div class="body">{{ campaign.template.buyer }}</div>
          </div>
          <div class="divider" />
          <div class="setup-section">
            <div class="number">3</div>
            <h2>Campiagn Leads</h2>
            <div class="body">{{ campaign.leadsFile.fileName }}</div>
          </div>
        </div>

        <SubmitButton
          class="mt-8"
          icon="i-heroicons-check"
          ready-text="Update Campaign"
          submitting-text="Updating Campaign"
          submitted-text="Campaign Updated"
          error-text="Try Again"
          :disabled="settingsNeedsMoreInput"
          :submissionState="settingsSubmissionState"
          @click="settingsSubmitFn" />
      </div>

      <div v-if="selectedTab === 1">
        <div class="border border-gray-200 rounded-md variables-grid">
          <div class="row">
            <h2>Variable Name</h2>
            <h2>Variable Description</h2>
            <h2>CSV Column Header</h2>
            <h2>Samples</h2>
          </div>

          <div v-for="(row, index) in variablesTranposed"
            class="row">
            <div class="body">{{ variableRowNameMaker(index) }}</div>
            <div class="body">{{ variableRowDescriptionMaker(index) }}</div>
            <div class="subtext">
              {{ campaign.leadsFile.headerRow[index] }}
            </div>
            <div class="flex flex-col gap-2 subtext">
              <div v-for="r in row">{{ r }}</div>
            </div>
          </div>
        </div>

        <SubmitButton
          v-if="!campaign.columnsApproved"
          class="mt-8"
          icon="i-heroicons-check"
          ready-text="Approve Variables"
          submitting-text="Approving Variables"
          submitted-text="Variables Approved"
          error-text="Try Again"
          :submissionState="columnsSubmissionState"
          @click="columnsSubmitFn" />
      </div>

      <div v-if="selectedTab === 2">
        <h2>Ready to Publish</h2>

        <div class="body">
          Clicking publish will create {{ campaign.leadsFile.dataRowsCount }} new
          Swaypages using the leads you've uploaded.
        </div>
        <SubmitButton
          v-if="!campaign.isPublished"
          color="green"
          class="mt-8"
          icon="i-heroicons-document-check"
          ready-text="Publish"
          submitting-text="Publishing"
          submitted-text="Published!"
          error-text="Try Again"
          :submissionState="publishSubmissionState"
          @click="publishSubmitFn" />
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
const selectedTab = ref(null)
if (campaign.isPublished) {
  selectedTab.value = 0
} else if (campaign.columnsApproved) {
  selectedTab.value = 2
} else {
  selectedTab.value = 1
}

const variablesTranposed = zip.apply(null, campaign.leadsFile.sampleRows)

function variableRowNameMaker (rowNumber) {
  if (rowNumber === 0) {
    return 'account-name'
  } else if (rowNumber === 1) {
    return 'first-name'
  } else if (rowNumber === 2) {
    return 'last-name'
  } else if (rowNumber === 3) {
    return 'email'
  } else if (rowNumber === 4) {
    return 'domain'
  }else {
    return `field-${rowNumber - 4}`
  }
}

// TODO pull this from template
function variableRowDescriptionMaker (rowNumber) {
  if (rowNumber === 0) {
    return 'Account Name'
  } else if (rowNumber === 1) {
    return 'First Name'
  } else if (rowNumber === 2) {
    return 'Last Name'
  } else if (rowNumber === 3) {
    return 'Email'
  } else if (rowNumber === 4) {
    return 'Domain'
  }else {
    return `Field #${rowNumber - 4}`
  }
}

const title = ref(campaign.title)
const { 
  submissionState: settingsSubmissionState, 
  submitFn: settingsSubmitFn,
} = useSubmit(async () => {
  await campaignsStore.updateCampaign({
    uuid: campaign.uuid,
    title,
  })
})
const settingsNeedsMoreInput = computed(() => !title.value)

const { 
  submissionState: columnsSubmissionState, 
  submitFn: columnsSubmitFn,
} = useSubmit(async () => {
  await campaignsStore.updateCampaign({
    uuid: campaign.uuid,
    columnsApproved: true,
  })
  selectedTab.value++
})

const { 
  submissionState: publishSubmissionState, 
  submitFn: publishSubmitFn,
} = useSubmit(async () => {
  await campaignsStore.publishCampaign({
    uuid: campaign.uuid
  })
  await navigateTo(`/campaigns/${campaign.uuid}`)
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
  grid-template-columns: repeat(4, minmax(auto, 1fr));

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
