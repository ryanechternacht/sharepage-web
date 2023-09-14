<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-8 bg-white rounded-md w-[600px]"
  >
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Create a New Buyersphere</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
        <input v-model="buyer" 
          ref="buyerElem"
          class="flex-grow mb-2"
          placeholder="Buyer Name">
        <input v-model="buyerLogo" 
          ref="buyerLogoElem"
          class="flex-grow mb-4"
          placeholder="Buyer Logo Url (https://...)">
      <SubmitButton 
        class="self-center"
        ready-text="Create Buyersphere"
        submitting-text="Creating"
        error-text="Invite Failed"
        :submission-state="submissionState"
        @click="invite" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useSubmit } from '@/composables/useSubmit';
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const props = defineProps({
  buyer: { type: String, required: true },
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const store = useBuyerspheresStore()

const { submissionState, submitFn, error } = useSubmit(async () => {
  await store.createBuyersphere({ buyer, buyerLogo })
})

const buyer = ref('')
const buyerElem = ref(null)
const buyerLogo = ref('')
const buyerLogoElem = ref(null)

function invite () {
  if (!buyer.value) {
    buyerElem.value.focus()
  } else if (!buyerLogo.value) {
    buyerLogoElem.focus()
  } else {
    submitFn()
  }
}

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
</style>
