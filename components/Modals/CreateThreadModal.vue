<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">New Thread</h2>
        <div>
          <div class="text-sm text-gray-500 mb-1">Thread Title *</div>
          <UInput
            v-model="title"
            placeholder="Thread Title" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Thread Type *</div>
          <USelect
            v-model="threadType"
            placeholder="Thread Type" 
            :options="threadTypes"
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Can Buyer Edit *</div>
          <USelect
            v-model="canBuyerEdit"
            :options="canBuyerEditOptions"
            class="w-full" />
        </div>
        <SubmitButton
          icon="i-heroicons-pencil-square"
          block
          ready-text="Save"
          submitting-text="Savings"
          submitted-text="Saved"
          error-text="Try Again"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" />
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'

const store = useSharepagesStore()

const props = defineProps({
  thread: { type: Object, default: {} },
  swaypageId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const title = ref('')

const canBuyerEdit = ref('Yes')
const canBuyerEditOptions = ['Yes', 'No']

const threadType = ref(null)
const threadTypes = [
  {
    label: 'General Thread',
    value: 'general',
  }, {
    label: 'Follow-up Thread',
    value: 'follow-up',
  }, {
    label: 'Guide',
    value: 'guide',
  }, {
    label: 'Discussion Doc',
    value: 'discussion',
  }, {
    label: 'Business Case',
    value: 'business-case',
  }, {
    label: 'Notes',
    value: 'notes',
  },
]

const { submissionState, submitFn } = useSubmit(async () => {
  const threadId = await store.createThread({
    sharepageId: props.swaypageId,
    thread: {
      title,
      pageType: threadType,
      canBuyerEdit: canBuyerEdit.value === 'Yes',
    },      
  })
  emit('close', { threadId })
})

const needsMoreInput = computed(() => !title.value 
  || !threadType.value || !canBuyerEdit.value)
</script>
