<template>
  <button 
    :disabled="disabled || submissionState === 'submitting'"
    @click="emit('click')"
  >
    <span v-if="submissionState === 'ready'">{{ readyText }}</span>
    <span v-else-if="submissionState === 'submitting'">{{ submittingText }}</span>
    <span v-else-if="submissionState === 'submitted'">{{ submittedText }}</span>
    <span v-else-if="submissionState === 'error'">{{ errorText }}</span>
  </button>
</template>

<script setup>
const props = defineProps({ 
  readyText: { type: String, default: 'Submit' },
  submittingText: { type: String, default: 'Submitting' },
  submittedText: { type: String, default: 'Submitted' },
  errorText: { type: String, default: 'Submission Error' },
  disabled: { type: Boolean, default: false },
  submissionState: { type: String, required: true }
})

const emit = defineEmits(['click'])
</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md bg-green-jewel body;
  
  span {
    @apply font-bold text-white;
  }
}
</style>
