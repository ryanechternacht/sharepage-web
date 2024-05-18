<template>
  <div class="component p-1 w-full flex flex-row flex-start gap-2">
    <div v-if="!readonly" class="w-[1rem] drag-handle"
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
          <div class="dropdown-menu">
            <div class="dropdown-item"
              dropdown-closer
              @click="emit('delete:item')">Delete</div>
            <hr class="border-gray-border">
            <h4 class="dropdown-description p-[.125rem]">Insert Below:</h4>
            <div class="dropdown-item"
              dropdown-closer
              @click="emit('insert:item', { item: 'header' })">Header</div>
            <div class="dropdown-item"
              dropdown-closer
              @click="emit('insert:item', { item: 'text' })">Text Block</div>
            <div v-if="includeAiPromptTemplate" 
              class="dropdown-item"
              dropdown-closer
              @click="emit('insert:item', { item: 'ai-prompt-template' })">
              Ai Prompt
            </div>
            <div v-if="includeAiPrompt" 
              class="dropdown-item"
              dropdown-closer
              @click="emit('insert:item', { item: 'ai-prompt' })">
              Ai Prompt
            </div>
            <div class="dropdown-item"
              dropdown-closer
              @click="emit('insert:item', { item: 'asset' })">Asset Link</div>
          </div>
        </template>
      </dropdown-menu>
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

const isDropdownOpen = ref(false)

const emit = defineEmits(['delete:item', 'insert:text', 'insert:header', 'insert:asset'])
</script>

<style lang="postcss" scoped>
.drag-handle {
  &:deep() > * {
    @apply hidden;
  }

  &.show-menu :deep() > * {
    @apply block;
  }

  &:has(+ .content:focus-within) :deep() > * {
    @apply block;
  }
}

.component:hover .drag-handle :deep() > * {
  @apply block;
}

.component:hover .content {
  @apply border-l-gray-subtext;

  &.readonly {
    @apply border-l-gray-border;
  }
}

.content {
  @apply w-full border-l-2 pl-2 border-white;
}
</style>
