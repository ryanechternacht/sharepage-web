<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">The Personas We Serve</h1>
    <input 
      v-model="personaTitle"
      ref="titleElem"
      class="mt-5"
      placeholder="Add Persona Title"
      @keyup.enter="checkReady('title')">
    <input
      v-model="personaDescription"
      ref="descriptionElem"
      class="mt-1"
      placeholder="Add Persona One Line Description"
      @keyup.enter="checkReady('description')">
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Persona"
      submitting-text="Saving Persona"
      submitted-text="Persona Saved"
      @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[800px]">
      <h3 class="mb-4">🚀 Who our product serves:</h3>
      <SetupItems
        :items="personas"
        @update-item="updatePersona"
        @delete-item="deletePersona" />
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { usePersonasStore } from '@/stores/personas'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const personasStore = usePersonasStore()
const { getPersonasCached } = storeToRefs(personasStore)

const [organization, personas] = await Promise.all([
  getOrganizationCached.value(),
  getPersonasCached.value(),
])

const { submissionState, submitFn } = useSubmit(async () => 
  await personasStore.createPersona({ persona: {
    title: personaTitle.value,
    description: personaDescription.value
  }}))

const personaTitle = ref('')
const personaDescription = ref('')
const titleElem = ref(null)
const descriptionElem = ref(null)

async function checkReady(elem) {
  if (personaTitle.value && personaDescription.value) {
    submitFn()
    personaTitle.value = ''
    personaDescription.value = ''
    titleElem.value.focus()
  } else if (elem === 'title') {
    descriptionElem.value.focus()
  } else {
    titleElem.value.focus()
  }
}

async function deletePersona({ item }) {
  await personasStore.deletePersona({ persona: item })
}

async function updatePersona({ item }) {
  await personasStore.updatePersona({ persona: item })
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full max-w-[600px];
}
</style>
