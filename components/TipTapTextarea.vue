<template>
  <editor-content 
    :editor="editor" 
    class="editor p-2 body gray bg-gray-light rounded-md min-h-[50px]" />
</template>

<script setup>
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'

const props = defineProps({ 
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({ 
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
    })
  ],
  onBlur() {
    emit('update:modelValue', editor.value.getHTML())
  }
})

watch(() => props.modelValue, (newModelValue) => {
  editor.value.commands.setContent(newModelValue, false)
})
</script>

<style lang="postcss" scoped>
.editor :deep() {
  *:focus-visible {
    outline: 0
  }

  li p {
    display: inline;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  p, div, span, .body, b {
    @apply gray;
  }
}
</style>
