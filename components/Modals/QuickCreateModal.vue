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
        
        <UFormGroup label="Buyer First Name">
          <UInput v-model="buyerFirstName"
            placeholder="Buyer First Name" />
        </UFormGroup>

        <UFormGroup label="Buyer Interest">
          <UInput v-model="buyerInterest"
            placeholder="Buyer Interest" />
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

const buyer = ref('')
const subname = ref('')
const buyerFirstName = ref('')
const buyerInterest = ref('')

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
  const templateData = { buyerFirstName, buyerInterest }

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
