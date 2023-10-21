<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col items-center gap-4">
      <h1>Edit Action Item</h1>
      <div class="w-full">
        <h3>What needs to be done</h3>
        <TipTapTextarea
          v-model="message"
          placeholder="What needs to be done?"
          class="w-full" />
      </div>
      <div class="w-full">
        <h3>Due Date</h3>
        <vue-date-picker 
          v-model="dueDate"
          :auto-apply="true"
          :enable-time-picker="false"
          placeholder="By when?" />
      </div>
      <div class="w-full">
        <h3>Assigned To</h3>
        <select v-model="assignedTo">
          <option disabled hidden value="null">Assigned to Whom?</option>
          <option v-for="u in allBuyersphereUsers"
            :value="u.id">
            {{ u.firstName }} {{ u.lastName }}
          </option>
        </select>
      </div>
      <div class="w-full">
        <h3>Resolved?</h3>
        <input type="checkbox" v-model="resolved">
      </div>
      <SubmitButton
        class="mx-20 h-[2.5rem]"
        :submission-state="submissionState" 
        ready-text="Save Action Item"
        submitting-text="Saving Action Item"
        submitted-text="Action Item Saved"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>


<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useSubmit } from '@/composables/useSubmit'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat } = lodash_pkg;

const props = defineProps({
  item: { type: Object, required: true },
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const store = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(store)
const buyersphere = await getBuyersphereByIdCached.value(props.buyersphereId)

const allBuyersphereUsers = computed(
  () => concat(buyersphere.buyerTeam, buyersphere.sellerTeam)
)

console.log('item', props.item)

const resolved = ref(props.item.resolved)
const message = ref(props.item.message)
const assignedTo = ref(props.item.assignedTo?.id)
const dueDate = ref(props.item.dueDate)

const { submissionState, submitFn } = useSubmit(async () => {
  store.updateConversation({ 
    buyersphereId: props.buyersphereId,
    conversationId: props.item.id,
    resolved: resolved.value,
    message: message.value,
    assignedTo: assignedTo.value,
    dueDate: dueDate.value,
  })
})

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
</style>
