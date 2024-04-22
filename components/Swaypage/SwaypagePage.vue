<template>
  <div class="[grid-area:right-header] flex flex-row-reverse items-center pr-12 gap-2 whitespace-nowrap">
    <SubmitButton v-if="canEdit"
      :ready-text="saveReadyText"
      :submitting-text="saveSubmittingText"
      :error-text="saveErrorText"
      :submission-state="saveSubmissionState"
      :disabled="!isDirty"
      @click="saveSubmitFn" />
    
    <EditButton v-if="isSeller"
      show-text
      edit-text="Page Settings"
      @click="openSettingsModal" />
  </div>

  <!-- remove !overflow-y-visible when we remove overflow-y-hidden from .page-center -->
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
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />
        
        <EditorHeader v-if="section.type === 'header'"
          v-model="section.text"
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />

        <EditorAsset v-if="section.type === 'asset'"
          v-model="section.link"
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @click:item="assetClick(section.link)"
          @delete:item="removeItem(index)" />
      </template>
    </VueDraggable>

    <template v-if="canEdit">
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
                @click="newTextBlock()">Text Block</div>
              <div class="dropdown-item"
                dropdown-closer
                @click="newHeader()">Header</div>
              <div class="dropdown-item"
                dropdown-closer
                @click="newAsset()">Asset</div>
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
import { useModal } from 'vue-final-modal'
import EditPageSettingsModal from '@/components/Swaypage/EditPageSettingsModal'

useEmbedly()

const route = useRoute()
const swaypageId = parseInt(route.params.id)

const buyersphereStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller, getMeCached } = storeToRefs(usersStore)

const [buyersphere, pages, hasUser, isSeller, user] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  getMeCached.value(),
])

const pageId = parseInt(route.params.page)
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

const canEdit = isSeller || page.canBuyerEdit

// TODO should this just come from the backend?
const isABuyerForThisBuyersphere = user && some(buyersphere.buyerTeam, p => p.email === user.email)

const router = useRouter()
const { makeInternalSwaypageLink } = useSwaypageLinks()

router.beforeEach(async () => {
  if (isDirty.value) {
    await debouncedSave.flush()
  }
})

setTimeout(() => router.replace({
  path: makeInternalSwaypageLink(buyersphere, page.id)
}), 100)

const keys = map(page.body.sections, s => s.key || 0)
let nextKey = (max(keys) || 0) + 1

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
const body = ref({ sections: map(page.body.sections, updateSection) })

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
  page.body = body.value
  await buyersphereStore.updatePage({ swaypageId, pageId, page })
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

const buyerActivityStore = useBuyerActivityStore()
function assetClick(link) {
  buyerActivityStore.captureBuyerActivity({
    buyersphereId: swaypageId,
    activity: "open-asset-v2",
    activityData: { link }
  })
}

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
    swaypageId,
    onClose () {
      close()
    },
  }
})

function openSettingsModal () {
  patchOptions({ attrs: { page }})
  open()
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
