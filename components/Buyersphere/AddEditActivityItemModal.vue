<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md">
    <div class="w-[36rem] flex flex-col items-center gap-2">
      <h1>{{ editMode ? "Edit" : "Add" }} Action Item</h1>
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
          <option value="action">Action</option>
          <option value="comment">Comment</option>
          <option value="meeting">Meeting</option>
          <option value="milestone">Milestone</option>
          <option value="question">Question</option>
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
        :ready-text="`${editMode ? 'Edit' : 'Add'} Action Item`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Action Item`"
        :submitted-text="`Action Item ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
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
  activity: { type: Object, default: {} },
  buyersphereId: { type: Number, required: true }
})

const editMode = ref(!!props.activity?.id)

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

const resolved = ref(props.activity?.resolved)
const message = ref(props.activity?.message)
const dueDate = ref(props.activity?.dueDate)
const assignedToId = ref(props.activity?.assignedTo?.id ??
  (props.activity?.assignedTeam === "buyer" ? -1 : -2))
const collaborationType = ref(props.activity?.collaborationType)

const assignedTeam = computed(
  () => find(allBuyersphereUsers.value, u => u.id === assignedToId.value).team
)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await buyersphereStore.updateConversation({ 
      buyersphereId: props.buyersphereId,
      conversationId: props.activity.id,
      resolved,
      dueDate,
      message,
      assignedTo: assignedToId.value > 0 ? assignedToId.value : null,
      assignedTeam,
      collaborationType,
    })
  } else {
    await buyersphereStore.startConversation({ 
      buyersphereId: props.buyersphereId,
      dueDate,
      message,
      assignedTo: assignedToId.value > 0 ? assignedToId.value : null,
      assignedTeam,
      collaborationType,
    })
  }
})

const needsMoreInput = computed(() => 
  !message.value || !dueDate.value || !collaborationType.value || !assignedToId.value)

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
</style>
