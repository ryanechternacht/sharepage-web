<template>
  <UButton 
    :disabled="disabled || submissionState !== 'ready'"
    :icon="currentIcon"
    :loading="submissionState === 'submitting'"
    :block
    :color
    :variant
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
  readyIcon: { type: String },
  submittingIcon: { type: String },
  submittedIcon: { type: String },
  errorIcon: { type: String },
  block: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
  variant: { type: String, default: 'solid' },
})

const currentIcon = computed(() => {
  if (props.submissionState === 'ready') {
    return props.readyIcon ?? props.icon
  } else if (props.submissionState === 'submitting') {
    return props.submittingIcon ?? props.icon
  } else if (props.submissionState === 'submitted') {
    return props.submittedIcon ?? props.icon
  } else if (props.submissionState === 'error') {
    return props.errorIcon ?? props.icon
  }
})

const emit = defineEmits(['click'])
</script>

<style lang="postcss" scoped>
</style>
