<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[24rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Welcome to the {{ buyersphere.buyer }} Sway Page</h3>
      </div>
      <div class="w-full mb-4">
        <p>To edit this page, you'll need an account.</p>
      </div>
      <div class="w-full flex flex-row justify-center gap-16">
        <BsButton
          hover-color="blue"
          @click="goToLogin">Login</BsButton>
        <BsButton
          color="blue"
          hover-color="blue"
          @click="goToSignup">Signup</BsButton>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  buyersphere: { type: Object, required: true },
})

const emit = defineEmits(['close'])

async function goToLogin () {
  await navigateTo('/login')
}

async function goToSignup () {
  await navigateTo(`/signup?swaypage-id=${props.buyersphere.id}`)
}
</script>
