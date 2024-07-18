<template>
  <UPopover mode="hover">
    <SubmitButton
      icon="i-heroicons-link"
      block
      submitted-icon="i-heroicons-check-circle"
      ready-text="Share"
      submitting-text="Share"
      submitted-text="Copied"
      error-text="Try Again"
      :submissionState="submissionState"
      @click="submitFn" />

    <template #panel>
      <div class="p-2">
        Copy to Clipboard
      </div>
    </template>
  </UPopover>
</template>

<script setup>
const props = defineProps({ 
  url: { type: String, required: true },
})

const emit = defineEmits(['click'])

const { submissionState, submitFn } = useSubmit(async () => {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(props.url)
  } else {
    console.log(`can't find navigator, but would copy ${props.url}`)
  }
  emit('click')
})
</script>

<style lang="postcss" scoped>
</style>
