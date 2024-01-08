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
        <h3>Due Date (days from Start)</h3>
        <input type="number" v-model="dueDateDays">
      </div>
      <div class="w-full">
        <h3>Assigned To</h3>
        <select v-model="assignedTeam">
          <option value="seller">
            {{ organization.name }} Team
          </option>
          <option value="buyer">
            Buyer Team
          </option>
        </select>
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
import { useOrganizationStore } from '@/stores/organization'
import { useActivityTemplateStore } from '@/stores/activity-template'
import { storeToRefs } from 'pinia'

const props = defineProps({
  activity: { type: Object, default: {} },
})

const editMode = ref(!!props.activity?.id)

const emit = defineEmits(['close'])

const activityTemplateStore = useActivityTemplateStore()

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [organization] = await Promise.all([
  getOrganizationCached.value()
])

const message = ref(props.activity?.message)
const dueDateDays = ref(props.activity?.dueDateDays)
const collaborationType = ref(props.activity?.collaborationType)
const assignedTeam = ref(props.activity?.assignedTeam)

const { submissionState, submitFn, error } = useSubmit(async () => {
  if (editMode.value) {
    activityTemplateStore.updateActivityTemplateItem({ 
      id: props.activity?.id,
      message,
      dueDateDays,
      assignedTeam,
      collaborationType,
    })
  } else {
    activityTemplateStore.createActivityTemplateItem({
      activityTemplateItem: {
      message,
      dueDateDays,
      assignedTeam,
      collaborationType,
      }
    })
  }
})

const needsMoreInput = computed(() => 
  !message.value || !dueDateDays.value || !collaborationType.value || !assignedTeam.value)

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
</style>
