<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md w-[400px]"
  >
    <div class="flex flex-col items-center gap-4">
      <h1>Buyersphere Settings</h1>
      <div class="w-full">
        <h3>Buyer Name</h3>
        <input v-model="buyerName" 
          class="w-full"
          placeholder="Buyer Name">
      </div>
      <div class="w-full">
        <h3>Buyer Logo</h3>
        <input v-model="buyerLogo" 
          class="w-full"
          placeholder="Buyer Logo">
      </div>
      <div class="w-full">
        <h3>Buyersphere Stage</h3>
        <select v-model="stage"
          class="w-full"
          placeholder="Current Stage">
          <option value="qualification">Qualification</option>
          <option value="evaluation">Evaluation</option>
          <option value="decision">Decision</option>
          <option value="adoption">Adoption</option>
        </select>
      </div>
      <div class="w-full">
        <h3>Qualification Target Date</h3>
        <vue-date-picker 
          v-model="qualificationTargetDate"
          :auto-apply="true"
          model-type="yyyy-MM-dd"
          :enable-time-picker="false"
          placeholder="By when?" />
      </div>
      <div class="w-full">
        <h3>Evaluation Target Date</h3>
        <vue-date-picker 
          v-model="evaluationTargetDate"
          :auto-apply="true"
          model-type="yyyy-MM-dd"
          :enable-time-picker="false"
          placeholder="By when?" />
      </div>
      <div class="w-full">
        <h3>Decision Target Date</h3>
        <vue-date-picker 
          v-model="decisionTargetDate"
          :auto-apply="true"
          model-type="yyyy-MM-dd"
          :enable-time-picker="false"
          placeholder="By when?" />
      </div>
      <div class="w-full flex flex-row items-center">
        <input id="showByDefault"
          type="checkbox"
          v-model="showPricing">
        <label for="showByDefault" class="ml-2 h3">Show Pricing</label>
      </div>
      <SubmitButton
        class="mx-20 h-[2.5rem]"
        :submission-state="submissionState" 
        ready-text="Save Buyersphere Settings"
        submitting-text="Saving Buyersphere Settings"
        submitted-text="Buyersphere Settings Saved"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'

const props = defineProps({
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])
const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const buyersphere = await getBuyersphereByIdCached.value(props.buyersphereId)

const buyerName = ref(buyersphere.buyer)
const buyerLogo = ref(buyersphere.buyerLogo)
const stage = ref(buyersphere.currentStage)
const qualificationTargetDate = ref(buyersphere.qualificationDate)
const evaluationTargetDate = ref(buyersphere.evaluationDate)
const decisionTargetDate = ref(buyersphere.decisionDate)
const showPricing = ref(buyersphere.showPricing)

const { submissionState, submitFn } = useSubmit(async () => {
  await buyersphereStore.saveBuyersphereSettings({
    buyersphereId: props.buyersphereId,
    buyer: buyerName.value,
    buyerLogo: buyerLogo.value,
    currentStage: stage.value,
    qualificationDate: qualificationTargetDate.value,
    evaluationDate: evaluationTargetDate.value,
    decisionDate: decisionTargetDate.value,
    showPricing: showPricing.value,
  })
})
</script>
