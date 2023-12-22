<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] h-[12rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ objective?.id ? "Edit" : "Add" }} Objective</h3>
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
        ready-text="Add Objective"
        submitting-text="Adding Objective"
        error-text="Adding Failed"
        :readonly="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />

    {{ error }}
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { usePainPointsStore } from '@/stores/pain-points'

const props = defineProps({
  objective: { type: Object, default: {} }
})

const emit = defineEmits(['close'])

const store = usePainPointsStore();

const title = ref(props.objective?.title)
const description = ref(props.objective?.description)

const { submissionState, submitFn, error } = useSubmit(async () => {
  if (props.objective?.id) {
    await store.updatePainPoint({ painPoint: {
      ...props.objective,
      title: title.value,
      description: description.value
    } })
  } else {
    await store.createPainPoint({ painPoint: {
      title: title.value,
      description: description.value
    } })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title || !description)
</script>

<style lang="postcss" scoped>
</style>
