<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Edit settings for {{ page.title }}</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div class="w-full">
        <h3>Page Title</h3>
        <input v-model="title"
          class="w-full"
          placeholder="Page Title">
      </div>
      <div v-if="!isTemplate" class="w-full">
        <h3>Page Type</h3>
        <select v-model="pageType" class="flex-grow">
          <option value="general">General Page</option>
          <option value="follow-up">Follow-up Page</option>
          <option value="guide">Guide</option>
          <option value="discussion">Discusion Doc</option>
          <option value="business-case">Business Case</option>
          <option value="notes">Notes</option>
        </select>
      </div>
      <div v-if="!isTemplate" class="w-full">
        <h3>Can Buyer Edit?</h3>
        <select v-model="canBuyerEdit" class="flex-grow">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
      <SubmitButton 
        class="self-center"
        ready-text="Edit Page Settings"
        submitting-text="Saving Page Settings"
        submitted-text="Page Settings Saved"
        error-text="Saving Failed"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useSwaypagesStore } from '@/stores/swaypages'
import { useTemplatesStore } from '@/stores/templates'

const props = defineProps({
  page: { type: Object, default: {} },
  swaypageId: { type: Number },
  pageTemplateId: { type: Number },
  isTemplate: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const title = ref(props.page?.title)
const canBuyerEdit = ref(props.page?.canBuyerEdit)
const pageType = ref(props.page?.pageType)

const { submissionState, submitFn } = useSubmit(async () => {
  if (props.isTemplate) {
    const templateStore = useTemplatesStore()
    await templateStore.updatePageTemplate({ 
      id: props.pageTemplateId,
      pageTemplate: { title }
    })
  } else {
    const swaypageStore = useSwaypagesStore()
    await swaypageStore.updatePage({ 
      swaypageId: props.swaypageId,
      pageId: props.page.id,
      page: { title, canBuyerEdit, pageType }
    })
  }
  emit('close')
})

const needsMoreInput = computed(() => {
  return !title.value
})
</script>

<style lang="postcss" scoped>
</style>
