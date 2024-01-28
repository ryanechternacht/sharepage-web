<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md">
    <div class="w-[36rem] flex flex-col items-center gap-2">
      <h1>{{ editMode ? "Edit" : "Add" }} Milestone</h1>
      <div class="w-full">
        <h3>Section Name</h3>
        <input v-model="title"
          class="w-full"
          placeholder="Milestone Name">
      </div>
      <SubmitButton
        class="mt-10 mx-20 h-[2.5rem]"
        :submission-state="submissionState" 
        :ready-text="`${editMode ? 'Edit' : 'Add'} Milestone`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Milestone`"
        :submitted-text="`Milestone ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>


<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  milestone: { type: Object, default: {} }
})

const editMode = ref(!!props.milestone?.id)

const emit = defineEmits(['milestone-created', 'milestone-edited', 'close'])

const title = ref(props.milestone.title)

const { submissionState, submitFn, error } = useSubmit(async () => {
  if (editMode.value) {
    emit('milestone-edited', { 
      milestone: {
        ...props.milestone,
        title,
      }
    })
    emit('close')
  } else {
    emit('milestone-created', { 
      milestone: {
        title,
      }
    })
    emit('close')
  }
})

const needsMoreInput = computed(() => !title.value)
</script>

<style lang="postcss" scoped>
</style>
