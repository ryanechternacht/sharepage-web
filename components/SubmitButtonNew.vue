<template>
  <UButton 
    :disabled="disabled"
    :icon="icon"
    :loading="submissionState === 'submitting'"
    block
    @click="emit('click')">
    <div class="center-xy">
      <span v-if="submissionState === 'ready'">{{ readyText }}</span>
      <span v-else-if="submissionState === 'submitting'">{{ submittingText }}</span>
      <span v-else-if="submissionState === 'submitted'">{{ submittedText }}</span>
      <span v-else-if="submissionState === 'error'">{{ errorText }}</span>
    </div>
  </UButton>
</template>

<script setup>
const props = defineProps({ 
  readyText: { type: String, default: 'Submit' },
  submittingText: { type: String, default: 'Submitting' },
  submittedText: { type: String, default: 'Submitted' },
  errorText: { type: String, default: 'Submission Error' },
  disabled: { type: Boolean, default: false },
  submissionState: { type: String, required: true },
  icon: { type: String },
})

const emit = defineEmits(['click'])
</script>

<style lang="postcss" scoped>
</style>
