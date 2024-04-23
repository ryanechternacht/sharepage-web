<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <!-- TODO combine this with EditPageSettingsModal -->
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Add New {{ pageOrTemplate }}</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div class="w-full">
        <h3>Page Title</h3>
        <input v-model="title"
          class="w-full"
          :placeholder="`${pageOrTemplate} Title`">
      </div>
      <div v-if="!props.isTemplate" class="w-full">
        <h3>Page Template</h3>
        <select v-model.number="pageTemplateId">
          <option disabled hidden selected value="-1">Choose a Template</option>
          <option value="0">Blank Page</option>
          <option v-for="pt in pageTemplates"
            :value="pt.id">{{ pt.title }}</option>
        </select>
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
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} ${pageOrTemplate}`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} ${pageOrTemplate}`"
        :submitted-text="`${pageOrTemplate} ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
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
  buyersphereId: { type: Number },
  isTemplate: { type: Boolean, default: false }
})

const editMode = ref(!!props.page.id)

const emit = defineEmits(['close'])

const title = ref(props.page?.title)
const pageTemplateId = ref(-1)
const pageType = ref('general')

const pageOrTemplate = props.isTemplate ? 'Page Template' : 'Page'

const templatesStore = useTemplatesStore()

const pageTemplates = ref([])
if (!props.isTemplate) {
  pageTemplates.value = await templatesStore.getPageTemplatesCached()
}

const { submissionState, submitFn } = useSubmit(async () => {
  // if (editMode.value) {
  //   await store.updatePage({
  //     buyersphereId: props.buyersphereId, 
  //     page: { ...page, title },
  //   })
  // } else {

  let pageId
  if (props.isTemplate) {
    pageId = await templatesStore.createPageTemplate({
      pageTemplate: { title },
    })
  } else {
    const buyersphereStore = useSwaypagesStore()
    pageId = await buyersphereStore.createPage({
      swaypageId: props.buyersphereId, 
      page: { title, pageTemplateId, pageType },
    })
  }
  emit('close', { pageId })
})

const needsMoreInput = computed(() => {
  return props.isTemplate
    ? !title.value
    : !title.value || pageTemplateId.value < 0
})
</script>

<style lang="postcss" scoped>
</style>
