<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Add New {{ pageType }}</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        class="w-full"
        :placeholder="`${pageType} Title`">
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

const pageType = props.isTemplate ? 'Page Template' : 'Page'

const { submissionState, submitFn } = useSubmit(async () => {
  // if (editMode.value) {
  //   await store.updatePage({
  //     buyersphereId: props.buyersphereId, 
  //     page: { ...page, title },
  //   })
  // } else {

  let pageId
  if (props.isTemplate) {
    const templatesStore = useTemplatesStore()
    pageId = await templatesStore.createPageTemplate({
      pageTemplate: { title },
    })
  } else {
    const buyersphereStore = useBuyerspheresStore()
    pageId = await buyersphereStore.createPage({
      buyersphereId: props.buyersphereId, 
      page: { title },
    })
  }
  emit('close', { pageId })
})

const needsMoreInput = computed(() => !title.value)
</script>

<style lang="postcss" scoped>
</style>
