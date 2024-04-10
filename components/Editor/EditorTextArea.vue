<template>
  <div class="component p-1 w-full flex flex-row flex-start gap-2">
    <div class="w-[1rem] drag-handle"
      :class="{ 'show-menu': isDropdownOpen }">
      <dropdown-menu
        :overlay="false"
        with-dropdown-closer
        @opened="isDropdownOpen = true"
        @closed="isDropdownOpen = false">
        <template #trigger>
          <MoreVerticalIcon class="mt-1" />
        </template>
        <template #body>
          <div class="flex flex-col gap-2 p-1">
            <div class="dropdown-item"
              dropdown-closer
              @click="emit('delete:item')">Delete</div>
          </div>
        </template>
      </dropdown-menu>
    </div>
    <!-- For some reason, setting height on this element and height: 100% on the
      inner .ProseMirror element makes the prose mirror set it's height correctly,
      but setting a min-height on here (and the height 100% on .ProseMirror) doesn't
      set the .ProseMirror height correctly. So we are going to flow a value down
      to the .ProseMirror -->
    <editor-content 
      :editor="editor"
      class="editor" />
  </div>
</template>

<script setup>
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'

const props = defineProps({ 
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
})

const isDropdownOpen = ref(false)

const emit = defineEmits(['update:modelValue', 'delete:item'])

const editor = useEditor({
  editable: !props.readonly,
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      dropcursor: false,
    }),
  ],
  onBlur() {
    emit('update:modelValue', editor.value.getHTML())
  }, 
  editorProps: {
    handleDOMEvents: {
      // prevents accidentally dropping text into editors when
      // using our current drag and drop solution
      drop: (view, e) => { e.preventDefault() }
    }
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
.drag-handle {
  &:deep() > * {
    @apply hidden;
  }

  &.show-menu :deep() > * {
    @apply block;
  }

  &:has(+ .editor:focus-within) :deep() > * {
    @apply block;
  }
}

.component:hover .drag-handle :deep() > * {
  @apply block;
}

.component:hover .editor {
  @apply border-l-gray-border;
}

.dropdown-item {
  @apply p-.5;
  
  &:hover {
    @apply hover:bg-gray-hover hover:px-[.5rem] hover:mx-[-.375rem]
      cursor-pointer;
  }
}

.editor {
  @apply w-full border-l-2 pl-2 border-white;

  :deep() {
    *:focus-visible {
      outline: 0
    }

    li p {
      display: inline;
    }

    p, div, span, .body, b {
      @apply gray;
    }

    .ProseMirror {
      @apply h-full;
    }
  }
}
</style>
