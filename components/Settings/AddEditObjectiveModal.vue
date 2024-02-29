<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Objective</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title" 
        class="mb-2"
        placeholder="Pain Point Title">
      <input v-model="description" 
        class="mb-4"
        placeholder="Pain Point One Line Description">
      <SubmitButton 
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Objective`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Objective`"
        :submitted-text="`Objective ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" /> 
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { usePainPointsStore } from '@/stores/pain-points'

const props = defineProps({
  objective: { type: Object, default: {} }
})

const editMode = ref(!!props.objective.id)

const emit = defineEmits(['close'])

const store = usePainPointsStore();

const title = ref(props.objective?.title)
const description = ref(props.objective?.description)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updatePainPoint({ painPoint: {
      ...props.objective,
      title,
      description,
    } })
  } else {
    await store.createPainPoint({ painPoint: {
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
