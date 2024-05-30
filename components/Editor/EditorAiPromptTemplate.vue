<template>
  <EditorItemTemplate :readonly="readonly"
    :include-ai-prompt-template="includeAiPromptTemplate"
    :include-ai-prompt="includeAiPrompt"
    @delete:item="emit('delete:item')">
    <!-- For some reason, setting height on this element and height: 100% on the
      inner .ProseMirror element makes the prose mirror set it's height correctly,
      but setting a min-height on here (and the height 100% on .ProseMirror) doesn't
      set the .ProseMirror height correctly. So we are going to flow a value down
      to the .ProseMirror -->
    <template #content>
      <div class="text-base font-bold">AI Prompt:</div>
      <editor-content
        :editor="editor"
        class="editor p-0 mb-2 border-t-0 border-x-0 border-b-1 border-gray-black rounded-none w-full" />
    </template>
  </EditorItemTemplate>
</template>

<script setup>
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
import lodash_pkg from 'lodash'
const { debounce } = lodash_pkg;

const props = defineProps({ 
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'delete:item'])

const editor = useEditor({
  editable: !props.readonly,
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      dropcursor: false,
    }),
    Placeholder.configure({
      placeholder: "Start writing...",
    })
  ],
  async onBlur() {
    debouncedUpdate()
  },
  editorProps: {
    handleDOMEvents: {
      // prevents accidentally dropping text into editors when
      // using our current drag and drop solution
      drop: (view, e) => { e.preventDefault() }
    }
  }
})

const debouncedUpdate = debounce(
  () => emit('update:modelValue', editor.value.getHTML()), 
  1000,
  { leading: false, trailing: true }
)

watch(() => props.modelValue, (newModelValue) => {
  editor.value.commands.setContent(newModelValue, false)
})

watch(() => props.readonly, (newReadonly) => {
  editor.value.setOptions({ editable: !newReadonly })
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
    @apply text-gray-700 text-sm;
  }

  .ProseMirror {
    @apply h-full;
  }
}
</style>
