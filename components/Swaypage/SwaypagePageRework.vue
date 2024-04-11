<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup
      v-if="canEdit"
      :options="pageViews"
      @update:option="updatePageView" />
  </div>

  <div class="[grid-area:right-header] flex flex-row-reverse items-center pr-12">
    <SubmitButton v-if="pageView === 'Edit'"
      :ready-text="saveReadyText"
      :submitting-text="saveSubmittingText"
      :error-text="saveErrorText"
      :submission-state="saveSubmissionState"
      :disabled="!isDirty"
      @click="saveSubmitFn" />
  </div>

  <!-- remove !overflow-y-visible when we remove overflow-y-hidden from .page-center -->
  <div class="[grid-area:center] page-center !overflow-y-visible">
    <!-- <template v-if="pageView === 'View'">
      <template v-for="section in body.sections">
        <div class="section"
          v-if="section.type === 'simple-text'">
          <div class="group-header">
            {{ section.title }}
            <div class="tag">{{ section.body.showAnswer ? "Input" : "Info" }}</div>
          </div>
          <div class="mt-4 inline-html" v-html="section.body.question" />
          
          <AutoSaveTipTapTextarea v-if="section.body.showAnswer"
            :model-value="section.body.answer"
            class="w-full mt-6"
            placeholder="Please enter an answer here"
            :readonly="!canUserRespond"
            :on-update-fn="(text) => section.body.answer = text" />
        </div>

        <div class="section"
          v-else-if="section.type === 'simple-list'">
          <div class="group-header">
            {{ section.title }}
            <div class="tag">Multi-select</div>
          </div>
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

        <div class="section"
          v-else-if="section.type === 'simple-asset'">
          <div class="group-header">
            {{ section.title }}
            <div class="tag">Asset</div>
          </div>
          <div v-if="section.body.description?.length > 0"
            class="mt-4 inline-html" v-html="section.body.description" />
          <a class="asset-link mb-2"
            :href="section.body.asset.link"
            target="_blank"
            @click="clickActivity(section.body.asset)">
            <BookIcon class="w-[1rem] h-[1rem]" />
            <span>Link - {{ section.body.asset.title }}</span>
          </a>

          <template v-if="!section.body.hidePreview && !autoHideAsset(section.body.asset.link)">
            <a v-if="!isGoogleDriveFile(section.body.asset.link)"
              :href="section.body.asset.link" 
              class="embedly-card"
              data-card-align="left"
              data-card-key="f7f5eddea12f4012bcbc6c7668ec40e4">
              {{ section.body.asset.title }}
            </a>
            <iframe v-else
              :src="rewriteLinkForGoogleDrivePreview(section.body.asset.link)"
              width="640"
              height="480"
              allow="autoplay" />
          </template>
        </div>
      </template>
    </template> -->

    <!-- <template v-else-if="pageView === 'Edit'"> -->
      <div v-if="pageView === 'Edit'" 
        class="section align-content-left">
        <div class="group-header">Page Settings</div>
        <h3 class="mt-4">Page Title</h3>
        <input class="mt-1" v-model="title" placeholder="Page Title">
        <template v-if="isSeller">
          <h3 class="mt-4">Can Buyer Edit?</h3>
          <select v-model="canBuyerEdit" class="flex-grow">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </template>
      </div>

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
            :readonly="pageView === 'View'"
            @delete:item="removeItem(index)" />
          
          <EditorHeader v-if="section.type === 'header'"
            v-model="section.text"
            :readonly="pageView === 'View'"
            @delete:item="removeItem(index)" />

          <EditorAsset v-if="section.type === 'asset'"
            v-model="section.link"
            :readonly="pageView === 'View'"
            @delete:item="removeItem(index)" />
        </template>
      </VueDraggable>

      <template v-if="pageView === 'Edit'">
        <div>
          <dropdown-menu class="align-content-left"
            :overlay="false"
            with-dropdown-closer
            @opened="isDropdownOpen = true"
            @closed="isDropdownOpen = false">
            <template #trigger>
              <NewButton hover-color="gray">Add</NewButton>
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

        <div class="flex flex-row-reverse">
          <SubmitButton 
            :ready-text="saveReadyText"
            :submitting-text="saveSubmittingText"
            :error-text="saveErrorText"
            :submission-state="saveSubmissionState"
            :disabled="!isDirty"
            @click="saveSubmitFn" />
        </div>
    </template>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, find, first, map, max, some } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useBuyerActivityStore } from '@/stores/buyer-activity';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'

useEmbedly()

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller, getMeCached } = storeToRefs(usersStore)

const [buyersphere, pages, hasUser, isSeller, user] = await Promise.all([
  getSwaypageByIdCached.value(buyersphereId),
  getSwaypagePagesByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  getMeCached.value(),
])

const pageViews = computed(() => [
  {text: 'View', active: true},
  {text: 'Edit', active: true},
])
const pageView = ref('View')
async function updatePageView ({ option }) {
  if (pageView.value === 'Edit') {
    await debouncedSave.flush()
  }

  pageView.value = option.text
}

const pageId = parseInt(route.params.page)
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

const canEdit = isSeller || page.canBuyerEdit

// TODO should this just come from the backend?
const isABuyerForThisBuyersphere = user && some(buyersphere.buyerTeam, p => p.email === user.email)
const canUserRespond = isSeller || isABuyerForThisBuyersphere

const router = useRouter()
const { makeSwaypageLink } = useSwaypageLinks()

router.beforeEach(async () => {
  if (isDirty.value) {
    await debouncedSave.flush()
  }
})

setTimeout(() => router.replace({
  path: makeSwaypageLink(buyersphere, page.id)
}), 100)

const keys = map(page.body.sections, s => s.key || 0)
let nextKey = max(keys) + 1

function updateSection (section) {
  const s = cloneDeep(section)
  if (!s.key) {
    s.key = nextKey++
  }

  if (section.type === "simple-text") {
    section.type = 'text'
    section.text = (section.title ? `<p>${section.title}</p>` : '')
      + section.body.question
      + section.body.answer
    // TODO unset section.body
  }

  if (section.type === 'simple-list') {
    section.type = 'text'
    section.text = (section.title ? `<p>${section.title}</p>` : '')
      + section.body.question
      + '<ul>' 
      + map(section.body.choices, c => `<li>${c.text}</li>`).join('')
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

// const body = ref(cloneDeep(page.body))
const body = ref({ sections: map(page.body.sections , updateSection) })
const title = ref(page.title)
const canBuyerEdit = ref(page.canBuyerEdit)

const emit = defineEmits(['require-login'])
function selectListIem ({ section, choice, index }) {
  if (hasUser) {
    section.body.answer.text = choice.text
    section.body.answer.index = index
  } else {
    emit('require-login')
  }
}

function autoHideAsset (link) {
  // google docs require special steps by the user to preview. for now
  // we will just hide
  return link.includes('docs.google.com/document')
}

function isGoogleDriveFile (link) {
  return link.includes('drive.google.com/file')
}

function rewriteLinkForGoogleDrivePreview (link) {
  return link.replace(/view/, 'preview')
}

if (process.client) {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) {
      debouncedSave.flush()
      e.preventDefault()
    }
  })
}

// Ideally we could use a middleware (vs. a manual route guard) to implement
// the save on route, but middlewares can only be registered on pages. This
// would require us to make the current page a layout, and then implement
// these components as pages. This is probably worth doing when we do a larger
// layout/styling rework
async function save() {
  page.title = title.value
  page.canBuyerEdit = canBuyerEdit.value
  page.body = body.value
  await buyersphereStore.updatePage({ swaypageId: buyersphereId, pageId, page })
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

watch(title, () => {
  isDirty.value = true
  debouncedSave()
})

watch(canBuyerEdit, () => {
  isDirty.value = true
  debouncedSave()
})

const buyerActivityStore = useBuyerActivityStore()
function clickActivity(asset) {
  buyerActivityStore.captureBuyerActivity({
    buyersphereId,
    activity: "open-asset",
    activityData: { title: asset.title, id: asset.id }
  })
}
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

.asset-link {
  @apply mt-4 border border-gray-border rounded-md hover:bg-gray-hover 
    px-2 py-1 flex flex-row gap-2 items-center;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  /* background-color: red; */
  /* border: 4px solid black; */
}

.page-section-add-button {
  /* midway - btn width - center right margin - extra for drag handle */
  margin-right: calc(50vw - 3.5rem - 3rem - (.5rem + 14px));
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
