<template>
  <!-- For some reason, setting height on this element and height: 100% on the
       inner .ProseMirror element makes the prose mirror set it's height correctly,
       but setting a min-height on here (and the height 100% on .ProseMirror) doesn't
       set the .ProseMirror height correctly. So we are going to flow a value down
       to the .ProseMirror -->
  <div>
    <editor-content 
      :editor="editor"
      class="editor p-2 body border border-gray-border rounded-md"
      :class="[isDemo ? 'bg-gray-hover' : 'bg-white']" />
    <div class="float-right tag italic w-[3.5rem] h-0">
      {{ savingStateMessage }}
    </div>
  </div>
</template>

<script setup>
// TODO figure out how to combine this with the default TipTapTextarea
// instead of just copying it


import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
import lodash_pkg from 'lodash';
const { debounce } = lodash_pkg;

const props = defineProps({ 
  modelValue: { type: String, required: true },
  placeholder: { type: String, default: '' },
  minHeight: { type: String, default: "40px" },
  readonly: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: false },
  // Should be fn(text) which is the new state
  onUpdateFn: { type: Function, required: true }
})

const { submissionState, submitFn } = useSubmit(
  async () => await props.onUpdateFn(editor.value.getHTML()))

const debouncedUpdate = debounce(() => submitFn(), 2000)

const editor = useEditor({
  editable: !(props.readonly || props.isDemo),
  content: props.isDemo ? '<i>To be filled in by the buyer</i>' : props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
    })
  ],
  onUpdate() {
    debouncedUpdate()
  }
})

const savingStateMessage = computed(() => ({
  'submitting': 'Saving...',
  'submitted': 'Saved!',
}[submissionState.value]))

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

.saving-state {
    @apply font-sans font-normal text-gray-subtext italic;
    font-size: .625rem; /* 10px */
  }
</style>
