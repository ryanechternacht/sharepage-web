<template>
  <div class="flex flex-col items-center gap-y-5">
    <template v-if="organization">
      <img 
        :src="organization ? organization.logo : '/logo-big.svg'"
        class="w-20">
      
      <h1>Signup for {{ organization.name }} Sharepage</h1>
      
      
      <div class="flex flex-col gap-2">
        <div class="flex flex-row mb-2 gap-x-2">
          <input v-model="firstName" 
            class="flex-grow"
            placeholder="First Name">
          <input v-model="lastName" 
            class="flex-grow"
            placeholder="Last Name">
        </div>
        <input v-model="email" 
          class="mb-2"
          placeholder="Email">
        <input v-model="displayRole" 
          class="mb-4"
          placeholder="Job Title">
        <SubmitButton
          class="self-center"
          :disabled="needsMoreInput"
          error-text="Something went wrong"
          ready-text="Signup"
          submitting-text="Sending Email"
          submitted-text="Email Sent!"
          :submission-state="submissionState"
          @click="submitFn" />
      </div>

      <div class="gray-italic w-[380px]">
        Clicking the button above will send an email to the provided address
        with a link to login. No password needed!
      </div>
    </template>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: "public",
});

const route = useRoute()
const swaypageId = route.query['swaypage-id']

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const organization = await getOrganizationCached.value()

const { apiFetch } = useNuxtApp();

const { submissionState, submitFn } = useSubmit(async () => {
  const { error } = await apiFetch('/v0.1/signup', { 
    method: 'POST',
    body: {
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      displayRole: displayRole.value,
      swaypageId,
    }
  })
  if (error.value) throw error.value;
})

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const displayRole = ref('')

const needsMoreInput = computed(() => {
  return !firstName.value || !lastName.value || !email.value || !displayRole.value
})
</script>

<style lang="postcss" scoped>
.google-button {
  @apply flex flex-row items-center border border-[#dadce0] 
    h-[40px] px-[12px] rounded-[4px];

  &:hover {
    @apply border-[#d2e3fc] bg-[rgba(66,133,244,.04)]
  }

  &:active {
    @apply bg-[rgba(66,133,244,.1)]
  }
}
</style>
