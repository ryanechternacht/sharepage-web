<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Create Sharepage from this Template
        </h2>
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

        <UFormGroup label="Context">
          <UInput v-model="subname"
            placeholder="Sales Divison, Team, etc" 
            class="w-full" />
        </UFormGroup>

        <h3>Template Data</h3>
        
        <UFormGroup label="Buyer Name">
          <UInput v-model="buyerName"
            placeholder="Buyer Name" />
        </UFormGroup>

        <UFormGroup label="Buyer Job Title">
          <UInput v-model="buyerJobTitle"
            placeholder="Buyer Job Title" />
        </UFormGroup>

        <UFormGroup label="Buyer Account">
          <UInput v-model="buyerAccount"
            placeholder="Buyer Account" />
        </UFormGroup>

        <UFormGroup label="Buyer Location">
          <UInput v-model="buyerLocation"
            placeholder="Buyer Location" />
        </UFormGroup>

        <UFormGroup label="Buyer Website">
          <UInput v-model="buyerWebsite"
            placeholder="Buyer Website" />
        </UFormGroup>

        <UFormGroup label="Seller Name">
          <UInput v-model="sellerName"
            placeholder="Seller Name" />
        </UFormGroup>

        <UFormGroup label="Seller Job Title">
          <UInput v-model="sellerJobTitle"
            placeholder="Seller Job Title" />
        </UFormGroup>

        <UFormGroup label="Seller Company">
          <UInput v-model="sellerCompany"
            placeholder="Seller Company" />
        </UFormGroup>

        <UFormGroup label="Seller Website">
          <UInput v-model="sellerWebsite"
            placeholder="Seller Website" />
        </UFormGroup>

        <SubmitButton 
          icon="i-heroicons-plus"
          block
          ready-text="Create"
          submitting-text="Creating"
          submitted-text="Created"
          error-text="Try Again"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" />
          {{ error }}
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { forEach, map } = lodash_pkg;

const props = defineProps({
  templateId: { type: Number, required: true },
})

const emit = defineEmits(['close'])
const store = useSharepagesStore()

const { getSharepageByIdCached } = storeToRefs(store)

const template = await getSharepageByIdCached.value(props.templateId)

const clearbitLoading = ref(false)
const clearbitLogo = ref(null)

const buyer = ref('Zello')
const subname = ref('')
const buyerName = ref('Chad Spain')
const buyerJobTitle = ref('Account Executive')
const buyerAccount = ref('Zello')
const buyerLocation = ref('Austin, Texas')
const buyerWebsite = ref('https://zello.com')
const sellerName = ref('Archer')
const sellerJobTitle = ref('Account Executive')
const sellerCompany = ref('Scratchpad')
const sellerWebsite = ref('https://www.scratchpad.com')

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

const { submissionState, submitFn, error } = useSubmit(async () => {
  const templateData = { 
    buyerName, buyerJobTitle, buyerAccount, buyerLocation, buyerWebsite,
    sellerName, sellerJobTitle, sellerCompany, sellerWebsite,
  }

  const sharepageId = await store.createSharepageFromGlobalTemplate({
    buyer,
    subname,
    buyerLogo: clearbitLogo.value.logo,
    templateData,
  })
  await store.invalidateAllSharepageCache()
  emit('close', { sharepageId })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)
</script>

<style lang="postcss" scoped>
</style>
