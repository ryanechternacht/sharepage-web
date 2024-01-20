<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col gap-2 w-[36rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit this" : "Create a new" }} Account</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div>
        <h3>Account Name (required)</h3>
        <input v-model="buyer"
          class="flex-grow mb-2"
          placeholder="Buyer Name">
      </div>
      <div>
        <h3>Group Name within Account</h3>
        <input v-model="subname"
          class="flex-grow mb-2"
          placeholder="Group Name">
      </div>
      <div>
        <h3>Account Logo (required)</h3>
        <input v-model="buyerLogo" 
          class="flex-grow mb-4"
          placeholder="Buyer Logo Url (https://...)">
      </div>
      <div v-if="editMode">
        <h3>Deal Status</h3>
        <select v-model="status"
          class="flex-grow">
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="opt-out">Archive</option>
        </select>
      </div>
      <div v-if="editMode">
        <h3>Show Pricing?</h3>
        <input type="checkbox" v-model="showPricing" class="!w-auto">
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
      <div v-if="editMode">
        <h3>Publicly Visible?</h3>
        <input type="checkbox" v-model="isPublic" class="!w-auto">
      </div>
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Account`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Account`"
        :submitted-text="`Account ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Account`"
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
  buyersphere: { type: Object, default: {}},
})

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const emit = defineEmits(['close'])

const editMode = ref(!!props.buyersphere.id)

const store = useBuyerspheresStore()

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.saveBuyersphereSettings({
      buyersphereId: props.buyersphere.id,
      buyer,
      subname,
      buyerLogo,
      status,
      showPricing,
      dealAmount,
      crmOpportunityId,
      isPublic,
    })
  } else {
    await store.createBuyersphere({ 
      buyer,
      subname,
      buyerLogo,
      dealAmount,
      crmOpportunityId,
    })
  }
  emit('close')
})

const buyer = ref(props.buyersphere?.buyer)
const subname = ref(props.buyersphere?.subname)
const buyerLogo = ref(props.buyersphere?.buyerLogo)
const status = ref(props.buyersphere.status)
const crmOpportunityId = ref(props.buyersphere?.crmOpportunityId)
const dealAmount = ref(props.buyersphere?.dealAmount)
const showPricing = ref(props.buyersphere.showPricing)
const isPublic = ref(props.buyersphere.isPublic)

const needsMoreInput = computed(() => !buyer.value || !buyerLogo.value)
</script>

<style lang="postcss" scoped>
input {
  @apply w-full
}
</style>
