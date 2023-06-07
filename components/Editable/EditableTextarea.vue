<template>
  <textarea
    v-if="edit" 
    :value="text"
    @blur="$emit('update:text', $event.target.value)" 
    rows="6"/>
  <span v-else>
    {{ text }}
  </span>
</template>

<script setup>
const props = defineProps({
  text: String,
  edit: Boolean
})

const emit = defineEmits(['update:text'])
</script>

<style lang="postcss" scoped>
  textarea {
    @apply w-full text-sm border-b-[1.5px] border-gray-300  
      text-gray-600 mb-1 w-full;
  }

span {
  @apply text-gray-600 text-sm;
}
</style>