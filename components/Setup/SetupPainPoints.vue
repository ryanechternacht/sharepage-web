<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">The Pain Points We Solve</h1>
    <h3 class="w-[600px] mt-5">Create New Pain Points</h3>
    <input
      v-model="painPointTitle"
      ref="titleElem"
      class="mt-1"
      placeholder="Pain Point Title"
      @keyup.enter="checkReady('title')">
    <input
      v-model="painPointDescription"
      ref="descriptionElem"
      class="mt-1"
      placeholder="Pain Point One Line Description"
      @keyup.enter="checkReady('description')">
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Pain Point"
      submitting-text="Saving Pain Point"
      submitted-text="Pain Point Saved"
      @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[800px]">
      <h3 class="mb-4">✅ Which customer pain points we solve:</h3>
      <SetupItems
        :items="painPoints"
        @update-item="updatePainPoint"
        @delete-item="deletePainPoint" />
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { usePainPointsStore } from '@/stores/pain-points'
import { storeToRefs } from 'pinia'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const [organization, painPoints] = await Promise.all([
  getOrganizationCached.value(),
  getPainPointsCached.value(),
])

const painPointTitle = ref('')
const painPointDescription = ref('')
const titleElem = ref(null)
const descriptionElem = ref(null)

const { submissionState, submitFn } = useSubmit(async () => 
  await painPointsStore.createPainPoint({ painPoint: {
    title: painPointTitle.value,
    description: painPointDescription.value
  }}))

async function checkReady(elem) {
  if (painPointTitle.value && painPointDescription.value) {
    submitFn()
    painPointTitle.value = ''
    painPointDescription.value = ''
    titleElem.value.focus()
  } else if (elem === 'title') {
    descriptionElem.value.focus()
  } else {
    titleElem.value.focus()
  }
}

async function deletePainPoint({ item }) {
  await painPointsStore.deletePainPoint({ painPoint: item })
}

async function updatePainPoint({ item }) {
  await painPointsStore.updatePainPoint({ painPoint: item })
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full max-w-[600px];
}
</style>
