<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup
      v-if="isSeller"
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
            :readonly="!hasUser"
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
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyerspherePagesByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, pages, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyerspherePagesByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
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

const pageId = parseInt(route.params.page)
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

const router = useRouter()
const { makeBuyersphereLink } = useBuyersphereLinks()

setTimeout(() => router.replace({
  path: makeBuyersphereLink(buyersphere, page.id)
}), 100)

const sections = ref(page.body.sections)
const title = ref(page.title)

const emit = defineEmits(['require-login'])
function selectListIem ({ section, choice, index }) {
  if (hasUser) {
    section.body.answer.text = choice.text
    section.body.answer.index = index
  } else {
    emit('require-login')
  }
}

function save() {
  page.title = title.value
  buyersphereStore.updatePage({ buyersphereId, pageId, page })
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

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }

  &.selected {
    /* wish the bg-color didn't have to be important */
    @apply !bg-blue-background px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem] cursor-pointer;
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }
  }
}
</style>
