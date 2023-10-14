<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Our Products Core Features</h1>
    <h3 class="w-[600px] mt-5">Create New Feature</h3>
    <input 
      v-model="featureTitle"
      ref="titleElem"
      class="mt-1"
      placeholder="Feature Title"
      @keyup.enter="checkReady('title')">
    <TipTapTextarea 
      v-model="featureDescription"
      ref="descriptionElem"
      class="mt-1 w-full max-w-[600px]"
      placeholder="Feature Description" />
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Feature"
      submitting-text="Saving Feature"
      submitted-text="Feature Saved"
      @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[800px]">
      <SetupItems
        :items="features"
        @update-item="updateFeature"
        @delete-item="deleteFeature">
        <template #display="{ index, item }">
          <h3 class="mb-1">Feature #{{ index + 1 }} {{ item.title }}</h3>
          <span class="gray inline-html" v-html="item.description" />
        </template>

        <template #editing="{ item, updateItem }">
          <input 
            :value="item.title"
            class="w-full"
            placeholder="Update Feature Title"
            @blur="ev => updateItem('title', ev.target.value)">
          <TipTapTextarea 
            :model-value="item.description"
            class="mt-1 w-full"
            placeholder="Update Feature Description" 
            @update:model-value="ev => updateItem('description', ev)" />
        </template>
      </SetupItems> 
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
const titleElem = ref(null)
const featureDescription = ref('')
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

async function deleteFeature({ item }) {
  await featuresStore.deleteFeature({ feature: item })
}

async function updateFeature({ item }) {
  await featuresStore.updateFeature({ feature: item })
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full max-w-[600px];
}
</style>
