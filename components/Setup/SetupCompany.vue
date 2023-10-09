<template>
<div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Our Company</h1>
    
    <div class="w-[600px] flex flex-col">
      <h3 class="mt-5">Company Name</h3>
      <input 
        v-model="companyName"
        class="mt-1"
        placeholder="Company Name">
      
      <h3 class="mt-5">Company Logo</h3>
      <input 
        v-model="companyLogo"
        class="mt-1"
        placeholder="Company Logo">

      <h3 class="mt-5">Buyersphere Subdomain (readonly)</h3>
      <input 
        v-model="organization.subdomain"
        readonly
        class="mt-1">

      <SubmitButton
        class="mt-10 mx-20"
        :submission-state="submissionState" 
        ready-text="Save Organization Settings"
        submitting-text="Saving Settings"
        submitted-text="Settings Saved"
        @click="submitFn" />
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia';

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)
const organization = await getOrganizationCached.value()

const companyName = ref(organization.name)
const companyLogo = ref(organization.logo)

const { submissionState, submitFn } = useSubmit(async () => 
  await organizationStore.saveOrganization({
    name: companyName.value,
    logo: companyLogo.value
  }))
</script>

<style lang="postcss" scoped>
</style>
