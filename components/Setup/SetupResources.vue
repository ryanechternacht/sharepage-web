<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Resources</h1>
    <h3>Default resources that auto show up in every buyersphere</h3>
    <input 
      v-model="resourceTitle"
      ref="titleElem"
      class="mt-5"
      placeholder="Add Resource Title"
      @keyup.enter="checkReady">
    <input
      v-model="resourceLink"
      class="mt-1"
      ref="linkElem"
      placeholder="Add Resource Link"
      @keyup.enter="checkReady('link')">
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Resource"
      submitting-text="Saving Resource"
      submitted-text="Resource Saved"
      @click="checkReady"/>

    <div class="mt-10 w-full max-w-[800px]">
      <BuyersphereResources :resources="resources"
        :hide-add="true"
        @update:resource="updateResource"
        @delete:resource="deleteResource" />
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { useResourcesStore } from '@/stores/resources'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const resourcesStore = useResourcesStore()
const { getResourcesCached } = storeToRefs(resourcesStore)

const [organization, resources] = await Promise.all([
  getOrganizationCached.value(),
  getResourcesCached.value(),
])

const { submissionState, submitFn } = useSubmit(async () => 
  await resourcesStore.createResource({ resource: {
    title: resourceTitle.value,
    link: resourceLink.value
  }}))

const resourceTitle = ref('')
const resourceLink = ref('')
const titleElem = ref(null)
const linkElem = ref(null)

async function checkReady() {
  if (resourceTitle.value && resourceLink.value) {
    submitFn()
    resourceTitle.value = ''
    resourceLink.value = ''
    titleElem.focus()
  } else if (!resourceTitle.value) {
    linkElem.value.focus()
  } else {
    titleElem.value.focus()
  }
}

async function deleteResource({ resourceId }) {
  await resourcesStore.deleteResource({ resourceId })
}

async function updateResource({ resourceId, link, title }) {
  await resourcesStore.updateResource({ resource: { id: resourceId, link, title } })
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full max-w-[600px];
}
</style>
