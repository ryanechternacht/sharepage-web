<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          {{ editMode ? 'Edit Chapter Settings' : 'New Chapter' }}
        </h2>
        <div>
          <div class="text-sm text-gray-500 mb-1">Chapter Title *</div>
          <UInput
            v-model="title"
            placeholder="Chapter Title" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Chapter Type *</div>
          <USelect
            v-model="chapterType"
            placeholder="Chapter Type" 
            :options="chapterTypes"
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
          {{  error }}
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'

const store = useSwaypagesStore()

const props = defineProps({
  chapter: { type: Object, default: {} },
  swaypageId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const editMode = !!props.chapter?.id

const title = ref(props.chapter?.title)

const canBuyerEdit = ref(props.chapter?.canBuyerEdit ? 'Yes' : 'No')
const canBuyerEditOptions = ['Yes', 'No']

const chapterType = ref(props.chapter?.pageType)
const chapterTypes = [
  {
    label: 'General Chapter',
    value: 'general',
  }, {
    label: 'Follow-up Chapter',
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

const { submissionState, submitFn, error } = useSubmit(async () => {
  let chapterId = null
  if (editMode) {
    await store.updateChapter({
      swaypageId: props.swaypageId,
      chapterId: props.chapter.id,
      chapter: {
        title,
        pageType: chapterType,
        canBuyerEdit: canBuyerEdit.value === 'Yes',
      },
    })
  } else {
    chapterId = await store.createChapter({
      swaypageId: props.swaypageId,
      chapter: {
        title,
        pageType: chapterType,
        canBuyerEdit: canBuyerEdit.value === 'Yes',
      },      
    })
  }
  emit('close', { chapterId })
})

const needsMoreInput = computed(() => !title.value 
  || !chapterType.value || !canBuyerEdit.value)

</script>