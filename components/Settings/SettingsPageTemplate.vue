<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup 
      :options="pageViews"
      header="Assigned To"
      @update:option="updatePageView" />
  </div>

  <div class="[grid-area:center] page-center">
    <template v-if="pageView === 'View'">
      <template v-for="section in sections">
        <div class="section"
          v-if="section.type === 'simple-text'">
          <div class="group-header">{{ section.title }}</div>
          <div class="mt-4 inline-html" v-html="section.body.question" />
          
          <AutoSaveTipTapTextarea v-if="section.body.showAnswer"
            :model-value="section.body.answer"
            class="w-full mt-6"
            placeholder="Please enter an answer here"
            :on-update-fn="(text) => section.body.answer = text" />
        </div>

        <div class="section"
          v-else-if="section.type === 'simple-list'">
          <div class="group-header">{{ section.title }}</div>
          <div class="mt-4 inline-html" v-html="section.body.question" />
          <div class="flex flex-col gap-4 mt-6">
            <div v-for="(c, i) in section.body.choices"
              class="item-list-row"
              :class="{'selected': i === section.body.answer.index}"
              @click="selectListIem({ section, choice: c, index: i })">
              <div class="main-content">{{ c.text }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <template v-else-if="pageView === 'Edit'">
      <div class="section">
        <div class="group-header">Page Title</div>
        <input v-model="title" class="mt-4">
      </div>
      <template v-for="section in sections">
        <div class="section"
          v-if="section.type === 'simple-text'">
          <input class="group-header-input"
            v-model="section.title"
            placeholder="Enter section title">
          <TipTapTextarea
            class="w-full mt-6"
            v-model="section.body.question"
            placeholder="Enter section body text" />
          <div class="w-full mt-6">
            <input v-model="section.body.showAnswer"
              id="hide-pricing" 
              type="checkbox"
              class="mr-2">
              <label for="hide-pricing">Show Answer Box?</label>
          </div>
        </div>

        <div class="section"
          v-else-if="section.type === 'simple-list'">
          <input class="group-header-input"
            v-model="section.title"
            placeholder="Enter section title">
          <TipTapTextarea
            class="w-full mt-6"
            v-model="section.body.question"
            placeholder="Enter section body text" />

          <h4>Answer Choices:</h4>
          <div class="flex flex-col gap-1">
            <div v-for="(c, i) in section.body.choices"
              class="flex flex-row gap-2">
              <input v-model="c.text"
                class="w-full"
                placeholder="Enter answer choice text">
              <DeleteButton @click="section.body.choices.splice(i, 1)" />
            </div>
          </div>
          <NewButton class="section-add-button"
            @click="section.body.choices.push({text: ''})" />
        </div>
      </template>

      <div class="section">
        <div class="group-header">Add New Block</div>
        <div class="mt-4 flex flex-row gap-4">
          <BsButton hover-color="blue"
              @click="addNewTextBlock">
            <div class="body-header mr-2">Text Block</div> 
            <TypeIcon />
          </BsButton>
          <BsButton hover-color="blue"
              @click="addNewListBlock">
            <div class="body-header mr-2">List Block</div> 
            <ListIcon />
          </BsButton>
        </div>
      </div>
    </template>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { debounce, find, first } = lodash_pkg;
import { useTemplatesStore } from '@/stores/templates'
import { storeToRefs } from 'pinia'

const templatesStore = useTemplatesStore()
const { getPageTemplatesCached } = storeToRefs(templatesStore)

const [pageTemplates] = await Promise.all([
  getPageTemplatesCached.value(),
])

const pageViews = computed(() => [
  {text: 'View', active: true},
  {text: 'Edit', active: true},
])
const pageView = ref('View')
function updatePageView ({ option }) {
  if (pageView.value === 'Edit') {
    debouncedSave.flush()
  }

  pageView.value = option.text
}

const route = useRoute()
const pageTemplateId = parseInt(route.params.id)
const pageTemplate = pageTemplateId
  ? find(pageTemplates, pt => pt.id === pageTemplateId)
  : first(pageTemplates)

const sections = ref(pageTemplate.body.sections)
const title = ref(pageTemplate.title)

function selectListIem ({ section, choice, index }) {
  section.body.answer.text = choice.text
  section.body.answer.index = index
}

function save() {
  pageTemplate.title = title.value
  templatesStore.updatePageTemplate({ id: pageTemplateId, pageTemplate })
}

const debouncedSave = debounce(save, 5000, { leading: false, trailing: true})

watch(sections.value, () => {
  debouncedSave()
})

watch(title, () => {
  debouncedSave()
})

function addNewTextBlock () {
  sections.value.push({
    type: "simple-text",
    title: "",
    body: {
      question: "",
      showAnswer: false,
      answer: "",
    }
  })
}

function addNewListBlock () {
  sections.value.push({
    type: "simple-list",
    title: "",
    body: {
      question: "",
      choices: [
        { text: "" },
        { text: "" },
        { text: "" },
      ],
      answer: {
        index: null,
        text: "",
      },
    },
  })
}
</script>

<style scoped lang="postcss">
</style>