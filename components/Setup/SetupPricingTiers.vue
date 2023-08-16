<template>
<div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Our Products Core PricingTiers</h1>
    <div class="flex flex-col gap-y-2 w-[600px]">
      <input 
        v-model="pricingTierTitle"
        ref="titleElem"
        class="w-full"
        placeholder="Add Pricing Tier Title"
        @keyup.enter="checkReady('title')">
      <input 
        v-model="pricingTierBestFor"
        ref="bestForElem"
        class="w-full"
        placeholder="Who is this Tier Best for?"
        @keyup.enter="checkReady('title')">
      <div class="flex flex-row gap-x-4">
        <input
          v-if="pricingTierPeriodType === 'other'"
          v-model="pricingTierAmountOther"
          ref="amountOtherElem"
          class="flex-grow"
          placeholder="What is the Pricing Cost?"
          @keyup.enter="checkReady('title')">
        <input
          v-else
          v-model="pricingTierAmountPerPeriod"
          type="Number"
          ref="amountPerPeriodElem"
          class="flex-grow"
          placeholder="What is the Pricing Cost? (Amount)"
          @keyup.enter="checkReady('title')">
        <select
          v-model="pricingTierPeriodType"
          ref="periodTypeElem"
          class="flex-grow"
          placeholder="What is the Pricing Interval?">
          <option value="monthly">Monthly</option>
          <option value="annually">Anually</option>
          <option value="per-seat">Per Seat</option>
          <option value="other">Other</option>
        </select>
      </div>
      <TipTapTextarea 
        v-model="pricingTierDescription"
        class="mt-1 w-full"
        placeholder="Add Pricing Tier Description"
        />
      </div>
      <SubmitButton
        class="mt-2 w-[10rem] h-[2.5rem]"
        :submission-state="submissionState" 
        ready-text="Add Pricing Tier"
        submitting-text="Saving Feature"
        submitted-text="Feature Saved"
        @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[800px]">
      <SetupItems
        :items="pricingTiers"
        @update-item="updatePricingTier"
        @delete-item="deletePricingTier">
        <!-- <template #display="{ index, item }">
          <h3 class="mb-1">Feature #{{ index + 1 }} {{ item.title }}</h3>
          <span class="gray inline-html" v-html="item.description" />
        </template> -->

        <!-- <template #editing="{ item, updateItem }">
          <input 
            :value="item.title"
            class="w-full"
            placeholder="Add Feature Title"
            @blur="ev => updateItem('title', ev.target.value)">
          <TipTapTextarea 
            :model-value="item.description"
            class="mt-1 w-full"
            placeholder="Add Feature Description" 
            @update:model-value="ev => updateItem('description', ev) "/>
        </template> -->
      </SetupItems> 
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { usePricingTiersStore } from '@/stores/pricing-tiers'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const pricingTiersStore = usePricingTiersStore()
const { getPricingTiersCached } = storeToRefs(pricingTiersStore)

const [organization, pricingTiers] = await Promise.all([
  getOrganizationCached.value(),
  getPricingTiersCached.value(),
])

const { submissionState, submitFn } = useSubmit(async () =>
  await pricingTiersStore.createPricingTier({ pricingTier: {
    title: pricingTierTitle.value,
    bestFor: pricingTierBestFor.value,
    amountPeriodPeriod: pricingTierAmountPerPeriod.value,
    amountOther: pricingTierAmountOther.value,
    periodType: pricingTierPeriodType.value,
    description: pricingTierDescription.value
  }}))

const pricingTierTitle = ref('')
const pricingTierBestFor = ref('')
const pricingTierAmountPerPeriod = ref('')
const pricingTierAmountOther = ref('')
const pricingTierPeriodType = ref('')
const pricingTierDescription = ref('')

const titleElem = ref(null)
const bestForElem = ref(null)
const amountPerPeriodElem = ref(null)
const amountOtherElem = ref(null)
const periodTypeElem = ref(null)
const descriptionElem = ref(null)

async function checkReady() {
  console.log('checkReady')
  console.log(pricingTierTitle.value, 
    pricingTierBestFor.value, 
    pricingTierAmountPerPeriod.value,
    pricingTierAmountOther.value, 
    pricingTierPeriodType.value,
    pricingTierDescription.value)
  if (pricingTierTitle.value && pricingTierBestFor.value && 
      (pricingTierAmountPerPeriod.value || pricingTierAmountOther.value) &&
      pricingTierPeriodType.value && pricingTierDescription.value) {
    submitFn()
    pricingTierTitle.value = ''
    pricingTierBestFor.value = ''
    pricingTierAmountPerPeriod.value = ''
    pricingTierAmountOther.value = ''
    pricingTierPeriodType.value = ''
    pricingTierDescription.value = ''
    titleElem.value.focus()
  } else if (!pricingTierTitle.value) {
    titleElem.value.focus()
  } else if (!pricingTierBestFor.value) {
    bestForElem.value.focus()
  } else if (pricingTierPeriodType.value !== 'other' && !pricingTierAmountPerPeriod.value) {
    amountPerPeriodElem.value.focus()
  } else if (pricingTierPeriodType.value === 'other' && !amountOtherElem.value) {
    amountOtherElem.value.focus()
  } else if (!pricingTierPeriodType.value) {
    periodTypeElem.value.focus()
  } else if (!pricingTierDescription.value) {
    descriptionElem.value.focus()
  } 
}
</script>

<style lang="postcss" scoped>
</style>
