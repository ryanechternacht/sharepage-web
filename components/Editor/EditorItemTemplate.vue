<template>
  <div class="component p-1 w-full flex flex-row flex-start gap-2">
    <div class="w-[1rem] drag-handle"
      :class="{ 'show-menu': isDropdownOpen }">
      <dropdown-menu
        :overlay="false"
        :class="{ '!hidden': readonly }"
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
      <div class="content" :class="{ readonly }">
        <slot name="content" />
      </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  readonly: { type: Boolean, default: false },
})

const isDropdownOpen = ref(false)

const emit = defineEmits(['delete:item'])
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

.dropdown-item {
  @apply p-.5;
  
  &:hover {
    @apply hover:bg-gray-hover hover:px-[.5rem] hover:mx-[-.375rem]
      cursor-pointer;
  }
}

.content {
  @apply w-full border-l-2 pl-2 border-white;
}
</style>
