<template>
  <EditorItemTemplate :readonly="readonly"
    :include-ai-prompt-template="includeAiPromptTemplate"
    :include-ai-prompt="includeAiPrompt"
    class="mb-2"
    @delete:item="emit('delete:item')">
    <template #content>
      <div v-if="readonly"
        class="text-lg font-bold text-black w-full"
        v-html="value" />
      <MultilineInput v-else
        :model-value="value"
        class="text-lg font-bold w-full"
        @update:model-value="v => emit('update:modelValue', v)" />
    </template>
  </EditorItemTemplate>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { clone } = lodash_pkg;

const props = defineProps({
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'delete:item'])

const value = ref(clone(props.modelValue))

watch(() => props.modelValue, (newModelValue) => {
  value.value = newModelValue
})
</script>

<style lang="postcss" scoped>
.hide-placeholder::placeholder {
  color: transparent;
}
</style>
