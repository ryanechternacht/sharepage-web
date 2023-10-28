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
        <h3>Collaboration Type</h3>
        <select v-model="collaborationType">
          <option value="comment">Comment</option>
          <option value="meeting">Meeting</option>
          <option value="question">Question</option>
          <option value="task">Task</option>
        </select>
      </div>
      <div class="w-full">
        <h3>Due Date</h3>
        <vue-date-picker 
          v-model="dueDate"
          :auto-apply="true"
          model-type="yyyy-MM-dd"
          :enable-time-picker="false"
          placeholder="By when?" />
      </div>
      <div class="w-full">
        <h3>Assigned To</h3>
        <select v-model="assignedToId">
          <option v-for="u in allBuyersphereUsers"
            :value="u.id">
            {{ u.firstName }} {{ u.lastName }}
          </option>
        </select>
        <p>Team: {{ capitalize(assignedTeam) }}</p>
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
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { capitalize, concat, find } = lodash_pkg;

const props = defineProps({
  item: { type: Object, required: true },
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(props.buyersphereId),
  getOrganizationCached.value()
])

const allBuyersphereUsers = computed(
  () => concat(
    {
      id: -1,
      firstName: buyersphere.buyer,
      lastName: "Team",
      team: "buyer"
    },
    buyersphere.buyerTeam ?? [], 
    {
      id: -2,
      firstName: organization.name,
      lastName: "Team",
      team: "seller"
    },
    buyersphere.sellerTeam ?? [])
)

const resolved = ref(props.item.resolved)
const message = ref(props.item.message)
const dueDate = ref(props.item.dueDate)
const assignedToId = ref(props.item.assignedTo?.id ??
  (props.item.assignedTeam === "buyer" ? -1 : -2))
const collaborationType = ref(props.item.collaborationType)

const assignedTeam = computed(
  () => find(allBuyersphereUsers.value, u => u.id === assignedToId.value).team
)

const { submissionState, submitFn } = useSubmit(async () => {
  buyersphereStore.updateConversation({ 
    buyersphereId: props.buyersphereId,
    conversationId: props.item.id,
    resolved: resolved.value,
    message: message.value,
    assignedTo: assignedToId.value > 0 ? assignedToId.value : null,
    dueDate: dueDate.value,
    assignedTeam: assignedTeam.value,
    collaborationType: collaborationType.value
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
