<template>
  <div class="flex flex-col items-center gap-y-5">
    <img src="/logo-big.svg">
    
    <h1>Welcome to the Buyersphere 🚀</h1>
    
    <input type="email" class="w-[380px]" placeholder="Enter your email" v-model="email"/>
    
    <button type="submit" class="w-[380px]" @click="sendEmail">{{ buttonText }}</button>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "public",
});

const { apiUrl } = useNuxtApp();

const email = ref('')

const buttonText = ref('Login')

async function sendEmail () {
  if (!email.value) return
  
  const { error } = await useFetch(apiUrl('/v0.1/send-magic-link-login-email'), { 
    method: 'POST', 
    body: { user_email: email.value }
  })
  
  if (!error) {
    buttonText.value = 'Email Sent!'
  }
}
</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md bg-blue-dark body;
  @apply font-bold text-green;
}
</style>
