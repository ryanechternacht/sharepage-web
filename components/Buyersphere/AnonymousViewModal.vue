<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
    background="interactive"
    :esc-to-close="false"
    overlay-class="backdrop-blur-sm h-screen w-screen fixed top-0"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Welcome to the {{ buyersphereName }} Sway Page</h3>
      </div>
      <div class="w-full">
        <h3>What's your name?</h3>
        <input v-model="name"
          class="w-full"
          placeholder="Enter your name">
      </div>
      <SubmitButton 
        class="self-center"
        ready-text="Enter"
        submitting-text="Entering"
        submitted-text="Entered"
        error-text="Something went wrong"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  buyersphereName: { type: String, required: true },
  linkedName: { type: String, default: "" }
})

const emit = defineEmits(['close'])

const name = ref(props.linkedName)

const { submissionState, submitFn } = useSubmit(async () => {
  emit('close', { name: name.value })
})

const needsMoreInput = computed(() => !name.value)
</script>