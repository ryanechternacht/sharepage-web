<template>
<div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Our Products Core PricingTiers</h1>
    <h3 class="w-[600px] mt-5">Create New Pricing Tier</h3>
    <div class="flex flex-col gap-y-2 w-[600px]">
      <input 
        v-model="pricingTierTitle"
        ref="titleElem"
        class="w-full"
        placeholder="Pricing Tier Title"
        @keyup.enter="checkReady()">
      <input 
        v-model="pricingTierBestFor"
        ref="bestForElem"
        class="w-full"
        placeholder="Who is this Tier Best for?"
        @keyup.enter="checkReady()">
      <div class="flex flex-row gap-x-4">
        <input
          v-if="pricingTierPeriodType === 'other'"
          v-model="pricingTierAmountOther"
          ref="amountOtherElem"
          class="flex-grow"
          placeholder="What does the Pricing Tier Cost?"
          @keyup.enter="checkReady()">
        <Money3Component
          v-else
          v-model.number="pricingTierAmountPerPeriod"
          ref="amountPerPeriodElem"
          class="flex-grow"
          placeholder="What does the Pricing Tier Cost? (Amount)"
          @keyup.enter="checkReady()"
          v-bind="moneyConfig" />
        <select
          v-model="pricingTierPeriodType"
          ref="periodTypeElem"
          class="flex-grow">
          <option disabled selected hidden value="">What is the Pricing Interval?</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Anually</option>
          <option value="per-seat">Per Seat</option>
          <option value="other">Other</option>
        </select>
      </div>
      <TipTapTextarea 
        v-model="pricingTierDescription"
        ref="descriptionElem"
        class="w-full"
        placeholder="Pricing Tier Description"
        />
      </div>
      <SubmitButton
        class="mt-2 w-[10rem] h-[2.5rem]"
        :class="{'bg-gray-light': pricingTiers.length >= 4}"
        :disabled="pricingTiers.length >= 4"
        :submission-state="submissionState" 
        :ready-text="pricingTiers.length < 4 ? 'Add Pricing Tier' : 'Only 4 Allowed'"
        submitting-text="Saving Pricing Tier"
        submitted-text="Pricing Tier Saved"
        @click="checkReady()"/>

    <div class="mt-10 w-full max-w-[800px]">
      <SetupItems
        :items="pricingTiers"
        @update-item="updatePricingTier"
        @delete-item="deletePricingTier">
        <template #display="{ item }">
          <div class="flex flex-row justify-between">
            <h3 class="mb-1">{{ item.title }}: Best for {{ item.bestFor }}</h3>
            <h3 v-if="item.periodType === 'other'">{{ item.amountOther }}</h3>
            <h3 v-else>${{ format(item.amountPerPeriod, moneyConfig) }}/{{ periodShortForm[item.periodType] }}</h3>
          </div>
          <span class="gray inline-html" v-html="item.description" />
        </template>

        <template #editing="{ item, updateItem }">
          <div class="flex flex-col gap-y-1">
            <input 
              :value="item.title"
              class="w-full"
              placeholder="Update Pricing Tier Title"
              @blur="ev => updateItem('title', ev.target.value)">
            <input 
              :value="item.bestFor"
              class="w-full"
              placeholder="Update Pricing Tier Best For"
              @blur="ev => updateItem('bestFor', ev.target.value)">
            <div class="flex flex-row gap-x-4">
              <input 
                v-if="item.periodType === 'other'"
                :value="item.amountOther"
                class="w-full"
                placeholder="Update Pricing Tier Cost"
                @blur="ev => updateItem('amountOther', ev.target.value)">
              <Money3Component
                v-else
                :model-value="item.amountPerPeriod"
                class="flex-grow"
                placeholder="Update Pricing Cost? (Amount)"
                v-bind="moneyConfig"
                @blur="ev => updateItem('amountPerPeriod', parseInt(ev.target.value))" />
              <select
                :value="item.periodType"
                @input="ev => updateItem('periodType', ev.target.value)"
                class="flex-grow">
                <option value="monthly">Monthly</option>
                <option value="annually">Anually</option>
                <option value="per-seat">Per Seat</option>
                <option value="other">Other</option>
              </select>
            </div>
            <TipTapTextarea 
              :model-value="item.description"
              class="mt-1 w-full"
              placeholder="Update Pricing Tier Description" 
              @update:model-value="ev => updateItem('description', ev) "/>
            </div>
        </template>
      </SetupItems> 
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { usePricingTiersStore } from '@/stores/pricing-tiers'
import { storeToRefs } from 'pinia'
import { format, Money3Component } from 'v-money3';

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

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
    amountPerPeriod: pricingTierAmountPerPeriod.value,
    amountOther: pricingTierAmountOther.value,
    periodType: pricingTierPeriodType.value,
    description: pricingTierDescription.value
  }}))

const periodShortForm = {
  'annually': 'yr',
  'monthly': 'mo', 
  'per-seat': 'seat'
}

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

async function deletePricingTier({ item }) {
  await pricingTiersStore.deletePricingTier({ pricingTier: item })
}

async function updatePricingTier({ item }) {
  await pricingTiersStore.updatePricingTier({ pricingTier: item })
}
</script>

<style lang="postcss" scoped>
</style>
