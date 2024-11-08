<template>
  <div class="component p-1 w-full flex flex-row flex-start gap-2">
    <div v-if="!readonly" class="min-w-[1rem] drag-handle mt-.5">
      <UDropdown :items="menu"
        :ui="{ item: { icon: { base: 'icon-submenu flex-shrink-0' }}}">
        <UIcon name="i-heroicons-ellipsis-vertical" />
      </UDropdown>
    </div>
    <div class="content" :class="{ readonly }">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const emit = defineEmits([
  'delete:item',
  'insert:item',
])

const menu = [
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => emit('delete:item'),
  }], 
  [{
    label: 'Insert Below',
    disabled: true,
  }, {
    label: 'Header',
    icon: 'i-heroicons-language',
    click: () => emit('insert:item', { item: 'header' }),
  }, {
    label: 'Text Block',
    icon: 'i-heroicons-bars-3-bottom-left',
    click: () => emit('insert:item', { item: 'text' }),
  }, 
  ...props.includeAiPrompt ? [{
    label: 'AI Prompt',
    icon: 'i-heroicons-computer-desktop',
    click: () => emit('insert:item', { item: 'ai-prompt' }),
  }] : [], 
  // ...props.includeAiPromptTemplate ? [{
  //   label: 'AI Prompt',
  //   icon: 'i-heroicons-computer-desktop',
  //   click: () => emit('insert:item', { item: 'ai-prompt-template' }),
  // }] : [], 
  {
    label: 'Asset',
    icon: 'i-heroicons-link',
    click: () => emit('insert:item', { item: 'asset' }),
  }]
]

</script>

<style lang="postcss" scoped>
.drag-handle {
  &:deep() > * {
    @apply hidden;
  }

  &:has(+ .content:focus-within) :deep() > * {
    @apply block;
  }

  div[data-headlessui-state="open"] {
    @apply block;
  }
}

.component:hover .drag-handle :deep() > * {
  @apply block;
}

.component:hover .content {
  @apply border-l-gray-500;

  &.readonly {
    @apply border-l-gray-200;
  }
}

.content {
  /* I'm not sure why the min-h is required, but there are some extra
     pixels that are getting added when I switched to UIcon :/ */
  @apply w-full border-l-2 pl-2 border-white min-h-[1.625rem];
}
</style>
