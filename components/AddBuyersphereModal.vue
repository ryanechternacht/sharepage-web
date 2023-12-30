<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col gap-2 w-[36rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Create a New Account</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div>
        <h3>Account Name (required)</h3>
        <input v-model="buyer"
          class="flex-grow mb-2"
          placeholder="Buyer Name">
      </div>
      <div>
        <h3>Account Logo (required)</h3>
        <input v-model="buyerLogo" 
          class="flex-grow mb-4"
          placeholder="Buyer Logo Url (https://...)">
      </div>
      <div>
        <h3>Deal Amount</h3>
        <Money3Component
          v-model.number="dealAmount"
          class="flex-grow"
          v-bind="moneyConfig" />
      </div>
      <div>
        <h3>CRM Opportunity ID</h3>
        <input v-model="crmOpportunityId" 
          class="flex-grow mb-2"
          placeholder="Opportunity ID in CRM">
      </div>
      <SubmitButton 
        class="self-center"
        ready-text="Create Account"
        submitting-text="Creating Account"
        submitted-text="Account Created"
        error-text="Account Creation Failed"
        :submission-state="submissionState"
        :disabled="needsMoreInput"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { Money3Component } from 'v-money3';

const props = defineProps({
  buyer: { type: String },
  dealAmount: { type: Number },
  crmOpportunityId: { type: String }
})

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const emit = defineEmits(['close'])

const store = useBuyerspheresStore()

const { submissionState, submitFn } = useSubmit(async () => {
  await store.createBuyersphere({ buyer, buyerLogo, crmOpportunityId, dealAmount })
})

const buyer = ref(props.buyer)
const buyerLogo = ref('')
const crmOpportunityId = ref(props.crmOpportunityId)
const dealAmount = ref(props.dealAmount)

const needsMoreInput = computed(() => !buyer.value || !buyerLogo.value)

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
input {
  @apply w-full
}
</style>
