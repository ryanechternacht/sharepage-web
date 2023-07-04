<template>
  <div class="flex flex-col items-center gap-y-5">
    <img src="/logo-big.svg">
    
    <h1>Welcome to the Buyersphere 🚀</h1>
    
    <input 
      v-model="email" 
      class="w-[380px]" 
      placeholder="Enter your email" 
      type="email" 
      @keypress.enter="sendEmail" />
    
    <button 
      class="w-[380px]" 
      :disabled="buttonDisabled"
      type="submit"
      @click="sendEmail">
      {{ buttonText }}
    </button>

    <div class="gray-italic w-[380px]">
      Clicking the button above will send an email to the provided address
      with a link to login. No password needed!
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "public",
});

const { apiFetch } = useNuxtApp();

const email = ref('')

const buttonText = ref('Login')
const buttonDisabled = ref(false)

async function sendEmail () {
  if (!email.value || buttonDisabled.value) return

  buttonDisabled.value = true
  buttonText.value = 'Sending Email'
  
  const { error } = await apiFetch('/v0.1/send-magic-link-login-email', { 
    method: 'POST', 
    body: { user_email: email.value }
  })

  if (!error.value) {
    buttonText.value = 'Email Sent!'
  } else {
    buttonText.value = 'Something went wrong'
    buttonDisabled.value = false
  }
}
</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md bg-blue-dark body;
  @apply font-bold text-green;
}
</style>
