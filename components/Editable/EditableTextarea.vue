<template>
    <Editor
      api-key="2htrrda1ywukt91mvkpsd7m0j884up00dz8u5jrllk8cf325"
      :init="{
        plugins: '',
        menubar: false,
      }"
      :inline="true"
      :class="{editable: edit, readonly: !edit}"
      :disabled="!edit"
      model-events="change keydown blur focus paste"
      :modelValue="text"
      @update:modelValue="newValue => $emit('update:text', newValue)"
    />
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  text: String,
  edit: Boolean
})

const emit = defineEmits(['update:text'])

const v = ref(props.text)
</script>

<style lang="postcss" scoped>
.editable {
  @apply text-sm border-b border-gray;
}

.readonly >>> {
  p, div, ul, ol {
    @apply text-gray-text;
  }
}

strong {
  @apply font-bold
}
</style>
