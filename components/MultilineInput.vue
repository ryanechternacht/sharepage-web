<template>
  <textarea
    v-model="value"
    rows="1"
    ref="textarea"
    class="p-0 border-0 rounded-none text-black resize-none outline-none"
    placeholder="Header"
    :readonly="readonly"
    @blur="emit('update:modelValue', value)"
    @input="removeNewLines" />
</template>

<script setup>
import lodash_pkg from 'lodash';
const { clone } = lodash_pkg;

const props = defineProps({
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const textarea = ref(null)

const value = ref(clone(props.modelValue))

// modified from from https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Textarea.vue
// i couldn't use the element directly because adjusting the model value to
// remove new lines wasn't being propogated back into the component for some reason
const autoResize = () => {
  if (!textarea.value) {
    return
  }

  textarea.value.rows = 1
  
  const styles = window.getComputedStyle(textarea.value)
  const paddingTop = parseInt(styles.paddingTop)
  const paddingBottom = parseInt(styles.paddingBottom)
  const padding = paddingTop + paddingBottom
  const lineHeight = parseInt(styles.lineHeight)
  const { scrollHeight } = textarea.value
  const newRows = (scrollHeight - padding) / lineHeight

  textarea.value.rows = newRows
}
onMounted(autoResize)

watch(() => props.modelValue, (newModelValue) => {
  value.value = newModelValue
})

function removeNewLines() {
  value.value = value.value.replace(/[\n\r]/g, '')
  nextTick(autoResize)
}
</script>

<style lang="postcss" scoped>
</style>
