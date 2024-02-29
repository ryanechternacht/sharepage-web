<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Pricing Tier</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title" 
        placeholder="Pricing Tier Title">
      <div class="flex flex-row gap-x-4">
        <input v-if="periodType === 'other'"
          v-model="amountOther"
          class="flex-grow"
          placeholder="What does the Pricing Tier Cost?">
        <Money3Component v-else
          v-model.number="amountPerPeriod"
          class="flex-grow"
          placeholder="What does the Pricing Tier Cost? (Amount)"
          v-bind="moneyConfig" />
        <select v-model="periodType"
          class="flex-grow">
          <option disabled selected hidden value="">What is the Pricing Interval?</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Anually</option>
          <option value="per-seat">Per Seat</option>
          <option value="other">Other</option>
        </select>
      </div>
      <TipTapTextarea
        v-model="description"
        placeholder="Pricing Tier Description" />
      <SubmitButton
        class="self-center mt-2"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Pricing Tier`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Pricing Tier`"
        :submitted-text="`Pricing Tier ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { usePricingStore } from '@/stores/pricing'
import { Money3Component } from 'v-money3';

const props = defineProps({
  pricingTier: { type: Object, default: {} }
})

const editMode = ref(!!props.pricingTier.id)

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const emit = defineEmits(['close'])

const store = usePricingStore();

const title = ref(props.pricingTier?.title)
const amountPerPeriod = ref(props.pricingTier?.amountPerPeriod)
const amountOther = ref(props.pricingTier?.amountOther)
const periodType = ref(props.pricingTier?.periodType)
const description = ref(props.pricingTier?.description)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updatePricingTier({ pricingTier: {
      ...props.pricingTier,
      title,
      amountPerPeriod,
      amountOther,
      periodType,
      description,
    } })
  } else {
    await store.createPricingTier({ pricingTier: {
      title,
      amountPerPeriod,
      amountOther,
      periodType,
      description,
    } })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value 
  || !(amountPerPeriod.value || amountOther.value)
  || !periodType.value
  || !description.value)
</script>

<style lang="postcss" scoped>
</style>
