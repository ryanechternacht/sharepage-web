<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Edit Page Settings
        </h2>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Page Title *</div>
          <UInput
            v-model="title"
            placeholder="Page Title" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Page Type *</div>
          <USelect
            v-model="pageType"
            placeholder="Page Title" 
            :options="pageTypes"
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Can Buyer Edit *</div>
          <USelect
            v-model="canBuyerEdit"
            :options="canBuyerEditOptions"
            class="w-full" />
        </div>
        <SubmitButtonNew 
          icon="i-heroicons-pencil-square"
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
import { useSwaypagesStore } from '@/stores/swaypages'

const store = useSwaypagesStore()

const props = defineProps({
  page: { type: Object, required: true },
  swaypageId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const title = ref(props.page?.title)

const canBuyerEdit = ref(props.page?.canBuyerEdit ? 'Yes' : 'No')
const canBuyerEditOptions = ['Yes', 'No']

const pageType = ref(props.page?.pageType)
const pageTypes = [
  {
    label: 'General Page',
    value: 'general',
  }, {
    label: 'Follow-up page',
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
  await store.updatePage({
    swaypageId: props.swaypageId,
    pageId: props.page.id,
    page: {
      title,
      pageType,
      canBuyerEdit: canBuyerEdit.value === 'Yes',
    },
  })
  emit('close')
})

const needsMoreInput = computed(() => !title.value 
  || !pageType.value || !canBuyerEdit.value)

</script>