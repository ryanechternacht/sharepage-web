<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          {{ editMode ? 'Edit Page Settings' : 'New Page' }}
        </h2>
        <div>
          <div class="text-sm text-gray-500 mb-1">Page Title *</div>
          <UInput
            v-model="title"
            placeholder="Page Title" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Page Type *</div>
          <USelect
            v-model="pageType"
            placeholder="Page Type" 
            :options="pageTypes"
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
  page: { type: Object, default: {} },
  swaypageId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const editMode = !!props.page?.id

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
  let pageId = null
  if (editMode) {
    await store.updatePage({
      swaypageId: props.swaypageId,
      pageId: props.page.id,
      page: {
        title,
        pageType,
        canBuyerEdit: canBuyerEdit.value === 'Yes',
      },
    })
  } else {
    pageId = await store.createPage({
      swaypageId: props.swaypageId,
      page: {
        title,
        pageType,
        canBuyerEdit: canBuyerEdit.value === 'Yes',
      },      
    })
  }
  emit('close', { pageId })
})

const needsMoreInput = computed(() => !title.value 
  || !pageType.value || !canBuyerEdit.value)

</script>