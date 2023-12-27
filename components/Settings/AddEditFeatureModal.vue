<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Feature</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        class="mb-2"
        placeholder="Feature Title">
      <TipTapTextarea 
        v-model="description"
        placeholder="Feature Description"
        class="w-full mb-4" />
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Feature`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Feature`"
        :submitted-text="`Feature ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useFeaturesStore } from '@/stores/features'

const props = defineProps({
  feature: { type: Object, default: {} }
})

const editMode = ref(!!props.feature.id)

const emit = defineEmits(['close'])

const store = useFeaturesStore();

const title = ref(props.feature?.title)
const description = ref(props.feature?.description)

const { submissionState, submitFn, error } = useSubmit(async () => {
  if (editMode.value) {
    await store.updateFeature({ feature: {
      ...props.feature,
      title: title.value,
      description: description.value
    } })
  } else {
    await store.createFeature({ feature: {
      title: title.value,
      description: description.value
    } })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value || !description.value)
</script>

<style lang="postcss" scoped>
</style>
