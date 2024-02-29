<template>
  <VueFinalModal
    class="center-xy"
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

const emit = defineEmits(['close'])

const editMode = ref(!!props.feature.id)

const store = useFeaturesStore();

const title = ref(props.feature?.title)
const description = ref(props.feature?.description)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updateFeature({ feature: {
      ...props.feature,
      title,
      description,
    } })
  } else {
    await store.createFeature({ feature: {
      title,
      description,
    } })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value || !description.value)
</script>

<style lang="postcss" scoped>
</style>
