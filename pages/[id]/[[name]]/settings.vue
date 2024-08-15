<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-2">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="gray"
        :to="makeInternalSharepageLink(sharepage)" />
      <h1>Settings</h1>
      <div class="flex-grow" />
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
        <div class="subtext">Internal Only</div>
      </div>
    </div>
    <div class="page-area">
      <UHorizontalNavigation :links="links"
        class="mb-4" />
      
      <div class="flex flex-col gap-4 max-w-[600px] px-[10px]">
        <UFormGroup label="Name" required>
          <UInput v-model="buyer"
            placeholder="Account Name" />
        </UFormGroup>
        
        <UFormGroup label="Logo"
          required
          help="Paste a link or type to search Clearbit for logos">
          <USelectMenu
            v-model="clearbitLogo"
            :loading="clearbitLoading"
            :searchable="lookupOnClearbit"
            by="logo"
            placeholder="Search for a company"
            option-attribute="logo"
            creatable>
            <template #option="{ option: { name, logo, domain } }">
              <div class="flex flex-row gap-2 items-center p-2">
                <img :src="logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
                <div class="grow">{{ name }}</div>
                <div class="shrink-0 tag">{{ domain }}</div>
              </div>
            </template>
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Use Url:</span>
              <Logo class="max-h-[1.25rem] h-full w-full max-w-[1.25rem] flex-shrink-0" :src="option.logo" />
              <span class="flex-grow block truncate text-gray-400 min-w-[8rem]">{{ option.logo }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup v-if="sharepage.roomType === 'deal-room'" 
          label="Context">
          <UInput v-model="subname"
            placeholder="Sales Divison, Team, etc" />
        </UFormGroup>

        <UFormGroup label="Priority">
          <USelect v-model.number="priority"
            :options="priorityOptions" />
        </UFormGroup>

        <UFormGroup label="Status">
          <USelect v-model="status"
            :options="statusOptions" />
        </UFormGroup>

        <UFormGroup label="Visibility">
          <USelect v-model="isPublic"
            :options="visibilityOptions" />
        </UFormGroup>
      </div>

      <SubmitButton
        class="mt-8 ml-[10px]"
        icon="i-heroicons-pencil-square"
        ready-text="Save"
        submitting-text="Savings"
        submitted-text="Saved"
        error-text="Try Again"
        :disabled="needsMoreInput"
        :submissionState="submissionState"
        @click="submitFn" />
    </div>
  </div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, map } = lodash_pkg;

const route = useRoute()
const sharepageId = parseInt(route.params.id)

const sharepageStore = useSharepagesStore()
const { 
  getSharepageByIdCached, 
  getSharepageThreadsByIdCached, 
} = storeToRefs(sharepageStore)

const [sharepage, chapters] = await Promise.all([
  getSharepageByIdCached.value(sharepageId),
  getSharepageThreadsByIdCached.value(sharepageId),
])

const { 
  makeInternalSharepageLink, 
  makeSharepageThreadSettingsLink,
} = useSharepageLinks()

const { getSharepageThreadTypeIcon } = useSharepageIcons()

const links = computed(() => filter(
  concat(
    [{
      label: 'Sharepage',
      icon: 'i-heroicons-document',
      to: makeInternalSharepageLink(sharepage, 'settings')
    }], 
    sharepage.roomType === 'template' ? {
      label: 'Variables',
      icon: 'i-heroicons-variable',
      to: makeInternalSharepageLink(sharepage, 'variables')
    } : null,
    map(chapters, (chapter) => ({
      label: chapter.title,
      icon: getSharepageThreadTypeIcon(chapter.pageType),
      to: makeSharepageThreadSettingsLink(sharepage, chapter.id)
    }))),
    x => x
))

const clearbitLoading = ref(false)
const clearbitLogo = ref({ logo: sharepage.buyerLogo })

const buyer = ref(sharepage.buyer)
const subname = ref(sharepage.subname)

const priority = ref(sharepage.priority)
const priorityOptions = [
  {
    label: 'High',
    value: 1,
  }, {
    label: 'Normal',
    value: 2,
  }, {
    label: 'Low',
    value: 3,
  },
]

const isPublic = ref(sharepage.isPublic ? 'public' : 'private')
const visibilityOptions = [
  {
    label: 'Public',
    value: 'public',
  }, {
    label: 'Private',
    value: 'private',
  },
]

const status = ref(sharepage.status)
const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  }, {
    label: 'Archive',
    value: 'archived',
  },
]

async function lookupOnClearbit (query) {
  clearbitLoading.value = true

  if (query) {
    const data = await $fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`
    )
    clearbitLoading.value = false
    return data
  } else {
    clearbitLoading.value = false
    return []
  }
}

const { submissionState, submitFn } = useSubmit(async () => {
  await sharepageStore.saveSharepageSettings({
    sharepageId: sharepage.id,
    buyer,
    priority,
    subname,
    buyerLogo: clearbitLogo.value.logo,
    isPublic: isPublic.value === 'public',
    pageTitle: 'New Thread',
    status,
  })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)

</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 pt-1 pb-4;
  /* this is based on the current top nav height */
  overflow: hidden;
}

:deep() ::marker {
  display: none;
  outline: red;
}
</style>