<template>
  <div class="[grid-area:right-header] flex flex-row-reverse items-center pr-12 gap-2 whitespace-nowrap">
    <SubmitButton
      :ready-text="saveReadyText"
      :submitting-text="saveSubmittingText"
      :error-text="saveErrorText"
      :submission-state="saveSubmissionState"
      :disabled="!isDirty"
      @click="saveSubmitFn" />
    
    <EditButton
      show-text
      edit-text="Page Settings"
      @click="openSettingsModal" />
  </div>

  <div class="[grid-area:center] page-center !overflow-y-visible">
    <VueDraggable
      v-model="body.sections"
      ghost-class="ghost"
      :animation="200"
      :scroll="true"
      class="flex flex-col gap-2"
      group="sections"
      handle=".drag-handle"
    >
      <template v-for="(section, index) in body.sections"
        :key="section.key">
        <EditorTextArea v-if="section.type === 'text'"
          v-model="section.text"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />
        
        <EditorHeader v-if="section.type === 'header'"
          v-model="section.text"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />

        <EditorAsset v-if="section.type === 'asset'"
          v-model="section.link"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @click:item="assetClick(section.link)"
          @delete:item="removeItem(index)" />
      </template>
    </VueDraggable>

    <div>
      <dropdown-menu class="align-content-left"
        :overlay="false"
        with-dropdown-closer>
        <template #trigger>
          <NewButton hover-color="gray">Add</NewButton>
        </template>
        <template #body>
          <div class="dropdown-menu">
            <div class="dropdown-item"
              dropdown-closer
              @click="newHeader()">Header</div>
            <div class="dropdown-item"
              dropdown-closer
              @click="newTextBlock()">Text Block</div>
            <div class="dropdown-item"
              dropdown-closer
              @click="newAsset()">Asset Link</div>
          </div>
        </template>
      </dropdown-menu>
    </div>

    <div class="flex flex-row-reverse">
      <SubmitButton
        :ready-text="saveReadyText"
        :submitting-text="saveSubmittingText"
        :error-text="saveErrorText"
        :submission-state="saveSubmissionState"
        :disabled="!isDirty"
        @click="saveSubmitFn" />
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, find, first, map, max, some } = lodash_pkg;
import { useTemplatesStore } from '@/stores/templates'
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import { useModal } from 'vue-final-modal'
import EditPageSettingsModal from '@/components/Swaypage/EditPageSettingsModal'

useEmbedly()

const templatesStore = useTemplatesStore()
const { getPageTemplatesCached } = storeToRefs(templatesStore)

const [pageTemplates] = await Promise.all([
  getPageTemplatesCached.value(),
])

const route = useRoute()
const pageTemplateId = parseInt(route.params.id)
const pageTemplate = pageTemplateId
  ? find(pageTemplates, pt => pt.id === pageTemplateId)
  : first(pageTemplates)

const router = useRouter()
router.beforeEach(async () => {
  if (isDirty.value) {
    await debouncedSave.flush()
  }
})

const keys = map(pageTemplate.body.sections, s => s.key || 0)
let nextKey = (max(keys) || 0) + 1

function updateSection (section) {
  const s = cloneDeep(section)
  if (!s.key) {
    s.key = nextKey++
  }

  if (s.type === "simple-text") {
    s.type = 'text'
    s.text = (s.title ? `<p>${s.title}</p>` : '')
      + s.body.question
      + s.body.answer
    // TODO unset s.body
  }

  if (s.type === 'simple-list') {
    s.type = 'text'
    s.text = (s.title ? `<p>${s.title}</p>` : '')
      + s.body.question
      + '<ul>' 
      + map(s.body.choices, c => `<li>${c.text}</li>`).join('')
      + '</ul>'
    // TODO unset s.body
  }

  if (s.type === 'simple-asset') {
    s.type = 'asset'
    s.link = s.body.asset.link
    // TODO unset s.body
  }

  return s
}

const body = ref({ sections: map(pageTemplate.body.sections, updateSection) })

if (process.client) {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) {
      debouncedSave.flush()
      e.preventDefault()
    }
  })
}

async function save() {
  pageTemplate.body = body.value
  await templatesStore.updatePageTemplate({ id: pageTemplateId, pageTemplate })
  isDirty.value = false
}

const debouncedSave = debounce(save, 2000, { leading: false, trailing: true })
const isDirty = ref(false)

const { submissionState: saveSubmissionState, submitFn: saveSubmitFn } = useSubmit(async () => {
  await debouncedSave.flush()
})

const saveReadyText = computed(() => isDirty.value ? "Save Changes" : "Saved")
const saveSubmittingText = "Saving Changes"
const saveErrorText = "Save Failed. Try Again"

watch(body.value, () => {
  isDirty.value = true
  debouncedSave()
})

function removeItem (index) {
  body.value.sections.splice(index, 1)
}

function newTextBlock (index) {
  const newBlock = {
    type: "text",
    text: "",
    key: nextKey++,
  }
  
  if (index) {
    body.value.sections.splice(index + 1, 0, newBlock)
  } else {
    body.value.sections.push(newBlock)
  }
}

function newHeader (index) {
  const newBlock = {
    type: "header",
    text: "",
    key: nextKey++,
  }
  
  if (index) {
    body.value.sections.splice(index + 1, 0, newBlock)
  } else {
    body.value.sections.push(newBlock)
  }
}

function newAsset (index) {
  const newBlock = {
    type: "asset",
    link: "",
    key: nextKey++,
  }
  
  if (index) {
    body.value.sections.splice(index + 1, 0, newBlock)
  } else {
    body.value.sections.push(newBlock)
  }
}

const { open, close, patchOptions } = useModal({
  component: EditPageSettingsModal,
  attrs: {
    pageTemplateId,
    isTemplate: true,
    onClose () {
      close()
    },
  }
})

function openSettingsModal () {
  patchOptions({ attrs: { page: pageTemplate }})
  open()
}
</script>

<style scoped lang="postcss">
.asset-link {
  @apply mt-4 border border-gray-border rounded-md hover:bg-gray-hover 
    px-2 py-1 flex flex-row gap-2 items-center;
}

.align-content-left {
  margin-left: calc(2.25rem + 1px);
}

.dropdown-item {
  @apply p-.5;
  
  &:hover {
    @apply hover:bg-gray-hover hover:px-[.5rem] hover:mx-[-.375rem]
      cursor-pointer;
  }
}
</style>