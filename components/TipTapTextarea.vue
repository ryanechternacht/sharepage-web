<template>
  <!-- For some reason, setting height on this element and height: 100% on the
       inner .ProseMirror element makes the prose mirror set it's height correctly,
       but setting a min-height on here (and the height 100% on .ProseMirror) doesn't
       set the .ProseMirror height correctly. So we are going to flow a value down
       to the .ProseMirror -->
  <editor-content 
    :editor="editor"
    class="editor p-2 body bg-white gray border border-cream-highlight rounded-md" />
</template>

<script setup>
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'

const props = defineProps({ 
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' },
  minHeight: { type: String, default: "40px" }
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

function focus () {
  editor.value.commands.focus()
}

defineExpose({ focus })
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

  .ProseMirror {
    @apply h-full;
    min-height: v-bind(minHeight);
  }
}
</style>
