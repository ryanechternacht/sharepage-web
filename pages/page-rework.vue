<template>
  <div class="m-10">
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
          @delete:item="removeItem(index)" />
        
        <EditorHeader v-if="section.type === 'header'"
          v-model="section.text"
          @delete:item="removeItem(index)" />

        <EditorAsset v-if="section.type === 'asset'"
          v-model="section.link"
          @delete:item="removeItem(index)" />
      </template>
    </VueDraggable>

    <dropdown-menu
      :overlay="false"
      with-dropdown-closer
      @opened="isDropdownOpen = true"
      @closed="isDropdownOpen = false">
      <template #trigger>
        <NewButton hover-color="gray"
          class="add-button">Add</NewButton>
      </template>
      <template #body>
        <div class="flex flex-col gap-2 p-1">
          <div class="dropdown-item"
            dropdown-closer
            @click="newTextBlock">Text Block</div>
          <div class="dropdown-item"
            dropdown-closer
            @click="newHeader">Header</div>
          <div class="dropdown-item"
            dropdown-closer
            @click="newAsset">Asset</div>
        </div>
      </template>
    </dropdown-menu>
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import lodash_pkg from 'lodash';
const { map, max, find, cloneDeep } = lodash_pkg;

const swaypageId = 81

const swaypageStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(swaypageStore)

const [swaypage, pages] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
])

const pageId = 94
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

const keys = map(page.body.sections, s => s.key || 0)
let nextKey = max(keys) + 1

function updateSection (section) {
  const s = cloneDeep(section)
  if (!s.key) {
    s.key = nextKey++
  }

  if (section.type === "simple-text") {
    section.type = 'text'
    section.text = section.body.question
      + section.body.answer
    // TODO unset section.body
  }

  if (section.type === 'simple-list') {
    section.type = 'text'
    section.text = section.body.question
      + '<ul>' + map(section.body.choices, c => `<li>${c.text}</li>`).join('')
      + '</ul>'
    // TODO unset section.body
  }

  if (section.type === 'simple-asset') {
    section.type = 'asset'
    section.link = section.body.asset.link
    // TODO unset section.body
  }

  return s
}

const body = ref({ sections: map(page.body.sections , updateSection) })

function removeItem (index) {
  body.value.sections.splice(index, 1)
}

function newTextBlock () {
  body.value.sections.push({
    type: "text",
    body: {
      text: "",
      key: nextKey++,
    },
  })
}

function newHeader () {
  body.value.sections.push({
    type: "header",
    body: {
      text: "",
      key: nextKey++,
    },
  })
}

function newAsset () {
  body.value.sections.push({
    type: "asset",
    body: {
      link: "",
      key: nextKey++,
    },
  })
}
</script>

<style lang="postcss" scoped>
.dropdown-item {
  @apply p-.5;
  
  &:hover {
    @apply hover:bg-gray-hover hover:px-[.5rem] hover:mx-[-.375rem]
      cursor-pointer;
  }
}

.add-button {
  @apply mt-2;
  margin-left: calc(2.25rem + 1px);
}
</style>
