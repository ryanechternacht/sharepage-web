<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Add New Page</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        class="w-full"
        placeholder="Page Title">
      <SubmitButton 
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Page`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Page`"
        :submitted-text="`Page ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
        {{ error }}
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const props = defineProps({
  page: { type: Object, default: {} },
  buyersphereId: { type: Number, required: true },
})

const editMode = ref(!!props.page.id)

const emit = defineEmits(['close'])

const store = useBuyerspheresStore();

const title = ref(props.page?.title)

const { submissionState, submitFn, error } = useSubmit(async () => {
  // if (editMode.value) {
  //   await store.updatePage({
  //     buyersphereId: props.buyersphereId, 
  //     page: { ...page, title },
  //   })
  // } else {
  const pageId = await store.createPage({
    buyersphereId: props.buyersphereId, 
    page: { title },
  })
  // }
  emit('close', { pageId })
})

const needsMoreInput = computed(() => !title.value)
</script>

<style lang="postcss" scoped>
</style>
