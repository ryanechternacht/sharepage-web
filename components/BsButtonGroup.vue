<template>
  <div class="flex flex-col items-center">
    <div class="tag-header mb-1">{{ header }}</div>
    <div class="button-group">
      <div v-for="option in options"
        class="button tag"
        :class="{ selected: option === mySelectedOption }"
        @click="selectOption(option)">
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  options: { type: Object, required: true },
  selectedOption: { type: String },
  header: { type: String }
 })

const emit = defineEmits(['update:option'])

const mySelectedOption = ref(props.selectedOption ?? props.options[0])

function selectOption (option) {
  mySelectedOption.value = option
  emit('update:option', { option })
}
</script>

<style lang="postcss" scoped>
.button-group {
  @apply flex flex-row items-center;

  .button {
    @apply py-1 px-2 border-y border-l border-gray-border;

    &.selected {
      @apply bg-gray-hover;
    }

    &:hover {
      @apply bg-gray-hover cursor-pointer;
    }

    &:first-child {
      @apply rounded-l-md
    }

    &:last-child {
      @apply rounded-r-md border-r;
    }
  }
}
</style>
