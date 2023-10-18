<template>
  <div class="flex flex-col items-center gap-y-5 mb-20">
    <img 
      :src="organization ? organization.logo : '/logo-big.svg'"
      class="w-20">
    
    <h1>
      {{ organization 
        ? `Welcome to ${organization.name}`
        : "Welcome to the Buyersphere 🚀" }}
    </h1>
    
    <input 
      v-model="email" 
      class="w-[380px]" 
      placeholder="Enter your email" 
      type="email" 
      @keypress.enter="submitFn" />
    
    <SubmitButton
      class="w-[380px]"
      :disabled="!email"
      error-text="Something went wrong"
      ready-text="Login"
      submitting-text="Sending Email"
      submitted-text="Email Sent!" 
      :submission-state="submissionState"
      @click="submitFn" />

    <div class="gray-italic w-[380px]">
      Clicking the button above will send an email to the provided address
      with a link to login. No password needed!
    </div>

    <a
      v-if="showGoogleLogin"
      :href="googleLoginLink"
      class="google-button">
      <img src="/svg/google.svg" class="mr-[18px] h-[18px] w-[18px]">
      <span class="text-[14px] text-medium" style="font-family: Roboto">
        Sign in with Google
      </span>
    </a>
  </div>
</template>

<script setup>
import { useSubmit } from '@/composables/useSubmit'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: "public",
});

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const organization = await getOrganizationCached.value()

const { apiFetch, apiSlug } = useNuxtApp();

const { submissionState, submitFn } = useSubmit(async () => {
  const { error } = await apiFetch('/v0.1/send-magic-link-login-email', { 
    method: 'POST', 
    body: { user_email: email.value }
  })
  if (error.value) throw error.value;
})

const email = ref('')

const { stytch } = useAppConfig()

const showGoogleLogin = computed(
  () => apiSlug !== 'app'
)

// TODO should this just be a backend call that redirects you?
const googleLoginLink = computed(
  () => `${stytch.baseUrl}/v1/b2b/public/oauth/google/start` +
    `?public_token=${stytch.publicToken}` + 
    `&slug=${apiSlug}` + 
    `&login_redirect_url=${stytch.redirectUri}`
)
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
