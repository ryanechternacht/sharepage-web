<template>
  <EditorItemTemplate :readonly="readonly"
    :include-ai-prompt-template="includeAiPromptTemplate"
    :include-ai-prompt="includeAiPrompt"
    @delete:item="emit('delete:item')">
    <template #content>
      <div>
        <UFormGroup v-if="!readonly" label="Link">
          <input
            v-model="section.link"
            class="p-0 mb-2 border-t-0 border-x-0 border-b-1 border-gray-black rounded-none w-full"
            :class="{'hidden': !loaded}"
            placeholder="Enter Link"
            @blur="sectionUpdated"
            @keypress.enter="sectionUpdated">
        </UFormGroup>
        <UFormGroup v-if="!readonly" label="Size">
          <USelect v-model="section.size"
            class="max-w-[10rem] mb-2"
            placeholder="Image Size"
            :options="sizes"
            @update:model-value="sectionUpdated" />
        </UFormGroup>
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
            :class="{'h-[240px] w-[320px]': section.size === 'small',
                     'h-[360px] w-[480px]': section.size === 'medium',
                     'h-[480px] w-[640px]': section.size === 'large',}"
            allow="autoplay" />
          <!-- TODO the click handlers below don't work since
               embedly sticks a new element in that we can't easily
               access to attach the handler -->
          <div v-else
            @click="clickHandler"
            class="track-me"
            :class="{'w-[40%]': section.size === 'small',
                     'w-[60%]': section.size === 'medium',
                     'w-[80%]': section.size === 'large',}">
            <a
              :href="link" 
              class="embedly-card truncate block"
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
const { concat, clone } = lodash_pkg;

const props = defineProps({ 
  modelValue: { type: Object },
  readonly: { type: Boolean, default: false },
  includeAiPromptTemplate: { type: Boolean, default: false },
  includeAiPrompt: { type: Boolean, default: false },
})

const sizes = computed(() => concat(
  isGoogleDriveFile(section.value.link) ? [] : [{
    label: 'Original',
    value: 'original',
  }], {
    label: 'Small',
    value: 'small',
  }, {
    label: 'Medium',
    value: 'medium',
  }, {
    label: 'Large',
    value: 'large',
  }))

const emit = defineEmits(['update:modelValue', 'delete:item', 'click:item'])

const section = ref(clone(props.modelValue))
section.value.size ||= 'original'

watch(() => props.modelValue, (newModelValue) => {
  section.value = clone(newModelValue)
})

useEmbedly()

// we use this as a poor man's way to ensure we create new elements
// so that the embedly card algo will create new cards
const fakeLinkArray = ref([section.value.link])

function sectionUpdated () {
  emit('update:modelValue', section.value);
  fakeLinkArray.value[0] = section.value.link
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
