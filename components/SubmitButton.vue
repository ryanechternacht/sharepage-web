<template>
  <button 
    :disabled="disabled || disabledFromSubmit"
    @click="doFn"
  >
    <span v-if="state === 'ready'">{{ readyText }}</span>
    <span v-else-if="state === 'submitting'">{{ submittingText }}</span>
    <span v-else-if="state === 'submitted'">{{ submittedText }}</span>
    <span v-else-if="state === 'error'">{{ errorText }}</span>
  </button>
</template>

<script setup>
const props = defineProps({ 
  readyText: { type: String, default: 'Submit' },
  submittingText: { type: String, default: 'Submitting' },
  submittedText: { type: String, default: 'Submitted' },
  errorText: { type: String, default: 'Submission Error' },
  submittedDurationMs: { type: Number, default: 3000 },
  clickFn: { type: Function, required: true },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click-error'])

const state = ref('ready')
const disabledFromSubmit = computed(() => state.value === 'submitting')

async function doFn () {
  state.value = 'submitting'
  try {
    await props.clickFn()
  } catch ($ex) {
    state.value = 'error'
    emit('click-error', $ex)
    setInterval(() => state.value = 'ready', props.submittedDurationMs)
    return
  }
  state.value = 'submitted'
  setInterval(() => state.value = 'ready', props.submittedDurationMs)
}
</script>

<style lang="postcss" scoped>
button {
  @apply p-2 rounded-md bg-blue-dark body;
  
  span {
    @apply font-bold text-white;
  }
}
</style>