<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Add New {{ pageType }}</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div class="w-full">
        <h3>Page Title</h3>
        <input v-model="title"
          class="w-full"
          :placeholder="`${pageType} Title`">
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
      <SubmitButton 
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} ${pageType}`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} ${pageType}`"
        :submitted-text="`${pageType} ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
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

const pageType = props.isTemplate ? 'Page Template' : 'Page'

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
    const buyersphereStore = useBuyerspheresStore()
    pageId = await buyersphereStore.createPage({
      buyersphereId: props.buyersphereId, 
      page: { title, pageTemplateId },
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
