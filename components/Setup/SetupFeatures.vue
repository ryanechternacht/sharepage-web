<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Our Products Core Features</h1>
    <input 
      v-model="featureTitle"
      ref="titleElem"
      class="mt-5"
      placeholder="Add Feature Title"
      @keyup.enter="checkReady('title')">
    <TipTapTextarea 
      v-model="featureDescription"
      class="mt-1 w-full max-w-[600px]"
      placeholder="Add Feature Description"
      />
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Feature"
      submitting-text="Saving Feature"
      submitted-text="Feature Saved"
      @click="checkReady('button')"/>

    <div class="flex flex-col gap-y-4 mt-8">
      <div v-for="(f, i) in features" class="w-full max-w-[800px]">
        <h3 class="mb-1">Feature #{{ i + 1 }} {{ f.title }}</h3>
        <span class="gray inline-html" v-html="f.description" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { useFeaturesStore } from '@/stores/features'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const [organization, features] = await Promise.all([
  getOrganizationCached.value(),
  getFeaturesCached.value(),
])

const { submissionState, submitFn } = useSubmit(async () => 
  await featuresStore.createFeature({ feature: {
    title: featureTitle.value,
    description: featureDescription.value
  }}))

const featureTitle = ref('')
const featureDescription = ref('')
const titleElem = ref(null)
const descriptionElem = ref(null)

async function checkReady(elem) {
  if (featureTitle.value && featureDescription.value) {
    submitFn()
    featureTitle.value = ''
    featureDescription.value = ''
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

.inline-html :deep() p:first-child {
  display: inline;
}

.inline-html :deep() li p {
  display: inline;
}
</style>
