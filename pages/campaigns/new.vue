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
        <h1>New Campaign</h1>
        <UTabs :items="tabs" />
      </div>
      <div class="border border-gray-200 rounded-md flex flex-col">
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
        @click="submitFn" />
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import { useCampaignsStore } from '@/stores/campaigns'

const campaignsStore = useCampaignsStore()

const tabs = [{
  label: 'Setup',
}, {
  label: 'Variables',
  disabled: true,
}, {
  label: 'AI Prompts',
  disabled: true,
}]

const templateName = ref(null)

// TODO better than this
const { apiFetch } = useNuxtApp()
const { data: swaypages } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})
const templateRooms = computed(() => 
  orderBy(
    filter(swaypages.value, 
      s => s.status !== 'archived' && s.roomType === 'template'),
    ['updatedAt'],
    ['desc']
  )
)
const selectedTemplate = ref(null)

const leadFile = ref(null)

function fileSelected ($e) {
  leadFile.value = $e[0]
}

const { submissionState, submitFn, error } = useSubmit(async () => {
  campaignsStore.createCampaign({
    title: templateName,
    file: leadFile,
    templateId: selectedTemplate.value.id
  })
})

const needsMoreInput = computed(
  () => !templateName.value || !selectedTemplate.value || !leadFile.value)
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
</style>
