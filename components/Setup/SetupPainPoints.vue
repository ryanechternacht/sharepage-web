<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">The Pain Points We Solve</h1>
    <input
      v-model="painPointTitle"
      ref="titleElem"
      class="mt-5"
      placeholder="Add Pain Point Title"
      @keyup.enter="checkReady('title')">
    <input
      v-model="painPointDescription"
      ref="descriptionElem"
      class="mt-1"
      placeholder="Add Pain Point One Line Description"
      @keyup.enter="checkReady('description')">
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Pain Point"
      submitting-text="Saving Pain Point"
      submitted-text="Pain Point Saved"
      @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[800px]">
      <h3>🚀 Which customer pain points we solve:</h3>
      <ul>
        <li v-for="p in painPoints" class="list-disc ml-4">
          <span class="font-bold">{{ p.title }}: </span>
          <span>{{ p.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { usePainPointsStore } from '@/stores/pain-points'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const [organization, painPoints] = await Promise.all([
  getOrganizationCached.value(),
  getPainPointsCached.value(),
])

const { submissionState, submitFn } = useSubmit(async () => 
  await painPointsStore.createPainPoint({ painPoint: {
    title: painPointTitle.value,
    description: painPointDescription.value
  }}))

const painPointTitle = ref('')
const painPointDescription = ref('')
const titleElem = ref(null)
const descriptionElem = ref(null)

async function checkReady(elem) {
  if (painPointTitle.value && painPointDescription.value) {
    await painPointsStore.createPainPoint({ painPoint: {
      title: painPointTitle.value,
      description: painPointDescription.value
    }})
    painPointTitle.value = ''
    painPointDescription.value = ''
    titleElem.value.focus()
  } else if (elem === 'title') {
    descriptionElem.value.focus()
  } else {
    titleElem.value.focus()
  }
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full max-w-[600px];
}
</style>
