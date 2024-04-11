<template>
  <EditorItemTemplate
    @delete:item="emit('delete:item')">
    <template #content>
      <input v-model="value"
        class="p-0 border-0 rounded-none text-lg text-black w-full"
        @blur="emit('update:modelValue', value)">
    </template>
  </EditorItemTemplate>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { clone } = lodash_pkg;

const props = defineProps({ 
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'delete:item'])

const value = ref(clone(props.modelValue))

watch(() => props.modelValue, (newModelValue) => {
  value.value = newModelValue
})
</script>

<style lang="postcss" scoped>
</style>
