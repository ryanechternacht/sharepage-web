<template>
  <EditorItemTemplate
    @delete:item="emit('delete:item')">
    <template #content>
      <div class="p-2 border border-gray-border rounded-md">
        <input v-model="value"
          class="p-0 border-0 rounded-none w-full"
          placeholder="Enter Link"
          @blur="valueChanged">
        <div v-for="link in fakeLinkArray"
          :key="link">
          <a
            :href="link" 
            class="embedly-card mt-1 text-white"
            data-card-align="left"
            data-card-key="f7f5eddea12f4012bcbc6c7668ec40e4">
            {{ link }}
          </a>
        </div>
      </div>
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

const { embedly } = useEmbedly()

// we use this as a poor man's way to ensure we create new elements
// so that the embedly card algo will create new cards
const fakeLinkArray = ref([value.value])

function valueChanged () {
  console.log(value.value)
  emit('update:modelValue', value.value);
  fakeLinkArray.value[0] = value.value
}
</script>

<style lang="postcss" scoped>
</style>
