<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Welcome to the {{ buyersphereName }} Sway Page</h3>
      </div>
      <div class="w-full mb-4">
        <p>To edit this page, you'll need to login</p>
      </div>
      <BsButton
        class="mx-auto"
        color="blue"
        hover-color="blue"
        @click="goToLogin">Go to Login Page</BsButton>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  buyersphereName: { type: String, required: true }
})

const emit = defineEmits(['close'])

async function goToLogin () {
  await navigateTo('/login')
}
</script>
