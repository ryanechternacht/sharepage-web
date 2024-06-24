<template>
  <EditorItemTemplate :readonly="readonly"
    :include-ai-prompt-template="includeAiPromptTemplate"
    :include-ai-prompt="includeAiPrompt"
    @delete:item="emit('delete:item')">
    <template #content>
      <div>
        <input v-if="!readonly" 
          v-model="value"
          class="p-0 mb-2 border-t-0 border-x-0 border-b-1 border-gray-black rounded-none w-full"
          :class="{'hidden': !loaded}"
          placeholder="Enter Link"
          @blur="valueChanged"
          @keypress.enter="valueChanged">
        <div v-for="link in fakeLinkArray"
          :key="link">
          <a v-if="isGoogleDocFile(link)"
            :href="link"
            @click="emit('click:item')"
            target="_blank">
            <div class="text-[#5f6368]">
              Google Doc
            </div>
            <img src="/svg/google-docs-logo.svg"
              class="max-h-[6rem]" />
          </a>
          <iframe v-else-if="isGoogleDriveFile(link)"
            :src="rewriteLinkForGoogleDrivePreview(link)"
            width="640"
            height="480"
            allow="autoplay" />
          <!-- TODO the click handlers below don't work since
               embedly sticks a new element in that we can't easily
               access to attach the handler -->
          <div v-else
            @click="clickHandler"
            class="track-me">
            <a
              :href="link" 
              class="embedly-card mt-1 text-white"
              data-card-align="left"
              data-card-key="f7f5eddea12f4012bcbc6c7668ec40e4"
              @click="emit('click:item')">
              {{ link }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </EditorItemTemplate>
</template>

<script setup>
function clickHandler () {
}

import lodash_pkg from 'lodash';
const { clone } = lodash_pkg;

const props = defineProps({ 
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'delete:item', 'click:item'])

const value = ref(clone(props.modelValue))

watch(() => props.modelValue, (newModelValue) => {
  value.value = newModelValue
})

const { embedly } = useEmbedly()

// we use this as a poor man's way to ensure we create new elements
// so that the embedly card algo will create new cards
const fakeLinkArray = ref([value.value])

function valueChanged () {
  emit('update:modelValue', value.value);
  fakeLinkArray.value[0] = value.value
}

function isGoogleDocFile (link) {
  // google docs require special steps by the user to preview. for now
  // we will just replace with a static placeholder
  return link.includes('docs.google.com/document')
}

function isGoogleDriveFile (link) {
  return link.includes('drive.google.com/file')
}

function rewriteLinkForGoogleDrivePreview (link) {
  // google docs require special steps by the user to preview. for now
  // we will just replace with a static placeholder
  return link.replace(/\/view/, '/preview')
}

const loaded = ref(false)
setTimeout(() => {
  loaded.value = true
}, 100)
</script>

<style lang="postcss" scoped>
</style>
