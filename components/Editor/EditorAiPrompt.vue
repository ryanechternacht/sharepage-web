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
        :editor="aiEditor"
        class="editor p-0 mb-2 border-b border-gray-200 rounded-none w-full" />

      <SubmitButton
        class="text-center"
        ready-text="Generate Text"
        submitting-text="Generating!"
        submitted-text="See Text Below"
        error-text="Please try again"
        :submission-state="submissionState"
        @click="submitFn" />
      
      <div class="mt-2 body">Output:</div>
      <editor-content
        :editor="outputEditor"
        class="editor p-0 mb-2 border-b border-gray-200 rounded-none w-full" />

      <UButton @click="commit">Save</UButton>
    </template>
  </EditorItemTemplate>
</template>

<script setup>
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import lodash_pkg from 'lodash'
const { cloneDeep } = lodash_pkg

const props = defineProps({ 
  modelValue: { type: Object },
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'delete:item'])

const aiEditor = useEditor({
  editable: !props.readonly,
  content: props.modelValue.prompt,
  extensions: [
    StarterKit.configure({
      dropcursor: false,
    }),
    Placeholder.configure({
      placeholder: "Start writing...",
    })
  ],
  async onBlur() {
    update()
  },
  editorProps: {
    handleDOMEvents: {
      // prevents accidentally dropping text into editors when
      // using our current drag and drop solution
      drop: (view, e) => { e.preventDefault() }
    }
  }
})

const outputEditor = useEditor({
  editable: !props.readonly,
  content: props.modelValue.output,
  extensions: [
    StarterKit.configure({
      dropcursor: false,
    }),
    Placeholder.configure({
      placeholder: "Start writing...",
    })
  ],
  async onBlur() {
    update()
  },
  editorProps: {
    handleDOMEvents: {
      // prevents accidentally dropping text into editors when
      // using our current drag and drop solution
      drop: (view, e) => { e.preventDefault() }
    }
  }
})

function update() {
  const newSection = cloneDeep(props.modelValue)
  newSection.prompt = aiEditor.value.getHTML()
  newSection.output = outputEditor.value.getHTML()
  emit('update:modelValue', newSection)
}

watch(() => props.modelValue, (newModelValue) => {
  aiEditor.value.commands.setContent(newModelValue.prompt, false)
  outputEditor.value.commands.setContent(newModelValue.output, false)
})

watch(() => props.readonly, (newReadonly) => {
  aiEditor.value.setOptions({ editable: !newReadonly })
  outputEditor.value.setOptions({ editable: !newReadonly })
})

function focus () {
  outputEditor.value.commands.focus()
}

defineExpose({ focus })

const { submissionState, submitFn } = useSubmit(async () => {
  const { apiFetch } = useNuxtApp()
  const { data } = await apiFetch('/v0.1/templates/generate-text', { 
    method: 'POST',
    body: {
      prompt: aiEditor.value.getHTML()
    }
  })

  outputEditor.value.commands.setContent(data.value.text, false)
  update()
})

function commit() {
  const newSection = cloneDeep(props.modelValue)
  newSection.type = 'text'
  newSection.text = newSection.output
  emit('update:modelValue', newSection)
}
</script>

<style lang="postcss" scoped>
.editor :deep() {
  *:focus-visible {
    outline: 0
  }

  li p {
    display: inline;
  }

  ul {
    list-style: circle !important;
    list-style-position: inside !important;
  }

  ol {
    list-style: decimal !important;
    list-style-position: inside !important;
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
