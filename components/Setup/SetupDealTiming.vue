<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Deal Timing</h1>
    <h3 class="mt-5">Default Amount of Time (days) for customer to be:</h3>
    <div class="mt-5 grid grid-cols-2 grid-rows-3 gap-y-2 gap-x-4">
      <h3>Qualified</h3>
      <input 
        v-model.number="qualifiedDays"
        type="Number"
        ref="qualifiedDaysElem"
        placeholder="30 days"
        @keyup.enter="checkReady()">
      <h3>Evaluation</h3>
      <input
        v-model.number="evaluationDays"
        type="Number"
        ref="evaluationDaysElem"
        placeholder="30 days"
        @keyup.enter="checkReady()">
      <h3>Decision</h3>
      <input
        v-model.number="decisionDays"
        type="Number"
        ref="decisionDaysElem"
        placeholder="30 days"
        @keyup.enter="checkReady()">
      <h3>Adoption</h3>
      <input
        v-model.number="adoptionDays"
        type="Number"
        ref="adoptionDaysElem"
        placeholder="30 days"
        @keyup.enter="checkReady()">
    </div>
    <SubmitButton
      class="mt-4 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Save Deal Timing"
      submitting-text="Saving Deal Timing"
      submitted-text="Deal Timing Saved"
      @click="checkReady()"/>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { useDealTimingStore } from '@/stores/deal-timing'
import { storeToRefs } from 'pinia'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const dealTimingStore = useDealTimingStore()
const { getDealTimingCached } = storeToRefs(dealTimingStore)

const [organization, dealTiming] = await Promise.all([
  getOrganizationCached.value(),
  getDealTimingCached.value(),
])

const qualifiedDays = ref(dealTiming?.qualifiedDays)
const evaluationDays = ref(dealTiming?.evaluationDays)
const decisionDays = ref(dealTiming?.decisionDays)
const adoptionDays = ref(dealTiming?.adoptionDays)
const qualifiedDaysElem = ref(null)
const evaluationDaysElem = ref(null)
const decisionDaysElem = ref(null)
const adoptionDaysElem = ref(null)

const { submissionState, submitFn } = useSubmit(async () => 
  await dealTimingStore.upsertDealTiming({ dealTiming: {
    qualifiedDays: qualifiedDays.value,
    evaluationDays: evaluationDays.value,
    decisionDays: decisionDays.value,
    adoptionDays: adoptionDays.value
  }}))

async function checkReady() {
  if (!qualifiedDays.value) {
    qualifiedDaysElem.value.focus()
  } else if (!evaluationDays.value) {
    evaluationDaysElem.value.focus()
  } else if (!decisionDays.value) {
    decisionDaysElem.value.focus()
  } else if (!adoptionDays.value) {
    adoptionDaysElem.value.focus()
  } else {
    submitFn()
  }
}
</script>

<style lang="postcss" scoped>
</style>
