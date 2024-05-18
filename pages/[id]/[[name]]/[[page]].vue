<template>
  <div class="page-grid">
    <h2 v-if="!page">
      There are no pages in this Swaypage. Create a New Page on the left
    </h2>
    <div v-else>
      <div v-if="page.status === 'archived'"
        class="p-2 rounded-md bg-gray-background flex flex-row items-center">
        <div>This page is currently archived.</div>
        <div class="flex-grow" />
        <SpButton @click="restorePage">
          <template #icon>
            <CornerUpLeftIcon class="icon-menu text-white" />
          </template>
          <div class="text-white">Restore Page</div>
        </SpButton>
      </div>
      <div class="h-[2.375rem] flex flex-row items-center gap-6">
        <div class="flex flex-row items-center">
          <UserAvatar v-for="s in swaypage.sellerTeam" 
            class="-mr-.5 shrink-0"
            size="small"
            :user="s" />
          <!-- TODO this text should be better -->
          <div class="ml-4 shrink-0">Made by
            <span v-for="(s, i) in swaypage.sellerTeam">{{ i > 1 ? "s.firstName, " : s.firstName }}</span>
          </div>
        </div>
        <div class="flex-grow" />
          <!-- TODO implement -->
        <!-- <div>active</div> -->
        <div v-if="canEdit" class="flex flex-row items-center gap-2 shrink-0">
          <template v-if="swaypage.isPublic">
            <EyeIcon class="text-green-good icon-menu" />
            <div class="subtext">Public</div>
          </template>
          <template v-else>
            <EyeOffIcon class="text-orange-neutral icon-menu" />
            <div class="subtext">Private</div>
          </template>
        </div>
        <div v-if="canEdit" class="flex flex-row items-center gap-2">
          <!-- Putting the :class directly on the icon prevented it from updating dynamically -->
          <div :class="{'text-blue-great': saveSubmissionState === 'ready' || saveSubmissionState === 'submitted',
                        'text-orange-neutral': saveSubmissionState === 'submitting'}">
            <FileIcon class="icon-menu" />
          </div>  
          <div class="subtext w-[3.25rem]">
            {{ !isDirty ? "Saved" :
                saveSubmissionState === 'submitting' ? "Saving" :
                saveSubmissionState === 'submitted' ? "Saved" :
                saveSubmissionState === 'ready' ? "Changes" : "??" }}
          </div>
        </div>
        <dropdown-menu
          direction="right"
          :overlay="false"
          with-dropdown-closer
          @opened="isDropdownOpen = true"
          @closed="isDropdownOpen = false">
          <template #trigger>
            <MoreVerticalIcon v-if="canEdit" class="-ml-4" />
          </template>
          <template #body>
            <div class="dropdown-menu">
              <div class="dropdown-item"
                dropdown-closer
                @click="openPageSettingsModal()">Edit Page Settings</div>
              <div class="dropdown-item"
                dropdown-closer
                @click="openSwaypageSettingsModal()">Edit SwayPage Settings</div>
            </div>
          </template>
        </dropdown-menu>
        <!-- <div>synced</div> -->
      </div>
      <div class="page-area">
        <input v-if="canEdit"
          v-model="title"
          type="text"
          class="w-full p-0 pl-[calc(2.25rem+2px)] h1 mt-10 mb-6 border-0">
        <h1 v-else class="mt-10 mb-6 ml-[calc(.75rem+2px)]">{{ title }}</h1>

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
              :include-ai-prompt="swaypage.roomType !== 'template'"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              @insert:item="insertBlock"
              @delete:item="removeItem(index)" />
            
            <EditorHeader v-if="section.type === 'header'"
              v-model="section.text"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="insertBlock"
              @delete:item="removeItem(index)" />

            <EditorAiPrompt v-if="section.type === 'ai-prompt'"
              v-model="section"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="insertBlock"
              @delete:item="removeItem(index)" />

            <EditorAiPromptTemplate v-if="section.type === 'ai-prompt-template'"
              v-model="section.prompt"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="insertBlock"
              @delete:item="removeItem(index)" />

            <EditorAsset v-if="section.type === 'asset'"
              v-model="section.link"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="insertBlock"
              @click:item="assetClick(section.link)"
              @delete:item="removeItem(index)" />
          </template>
        </VueDraggable>

        <div v-if="canEdit">
          <dropdown-menu class="align-content-left"
            :overlay="false"
            with-dropdown-closer
            @opened="isDropdownOpen = true"
            @closed="isDropdownOpen = false">
            <template #trigger>
              <div class="mt-2 flex flex-row gap-2 items-center cursor-pointer rounded-md py-2 px-1">
                <PlusSquareIcon class="text-gray-medium icon-menu" />
                <div class="subtext">New</div>
              </div>
            </template>
            <template #body>
              <div class="flex flex-col gap-2 p-1">
                <div class="dropdown-item"
                  dropdown-closer
                  @click="newHeader()">Header</div>
                <div class="dropdown-item"
                  dropdown-closer
                  @click="newTextBlock()">Text Block</div>
                <div v-if="swaypage.roomType !== 'template'" 
                  class="dropdown-item"
                  dropdown-closer
                  @click="newAiBlock()">AI Prompt Block</div>
                <div v-if="swaypage.roomType === 'template'" 
                  class="dropdown-item"
                  dropdown-closer
                  @click="newAiTemplateBlock()">AI Prompt Block</div>
                <div class="dropdown-item"
                  dropdown-closer
                  @click="newAsset()">Asset Link</div>
              </div>
            </template>
          </dropdown-menu>
        </div>

        <div class="h-[2rem]" /> <!-- bottom spacer -->
      </div>
    </div>
    <div>
      <div class="ml-2">
        <div class="sticky top-[5.75rem]">
          <div class="mt-[5.75rem] flex flex-col gap-4 items-end">
            <div class="text-gray-medium">Key Links</div>
            <VueDraggable
              v-model="links"
              ghost-class="ghost"
              :animation="200"
              :scroll="false"
              class="flex flex-col -mr-6"
              group="pages"
              handle=".drag-handle"
            >
              <div v-for="l in links"
                class="group/link-item flex flex-row-reverse items-center">
                <div class="w-[1.5rem] flex-shrink-0 text-right">
                  <dropdown-menu
                    direction="right"
                    :overlay="false"
                    with-dropdown-closer>
                    <template #trigger>
                      <MoreVerticalIcon v-if="isSeller"
                        class="drag-handle icon-menu cursor-pointer hidden group-hover/link-item:block" />
                    </template>
                    <template #body>
                      <div class="dropdown-menu">
                        <div class="dropdown-item"
                          dropdown-closer
                          @click="editLink(l)">Edit</div>
                        <div class="dropdown-item"
                          dropdown-closer
                          @click="deleteLink(l)">Delete</div>
                      </div>
                    </template>
                  </dropdown-menu>
                </div>
                <a class="rightbar-link"
                  :href="l.linkUrl"
                  target="_blank"
                  @click="trackLinkClick(l.title)">
                  <ExternalLinkIcon class="icon-menu" />
                  <div class="text-right">{{ l.title }}</div>
                </a>
              </div>
              
              <div v-if="isSeller"
                class="rightbar-link"
                @click="createNewLink">
                <PlusSquareIcon class="icon-menu text-gray-medium mr-6" />
                <div class="text-gray-medium text-right">New Link</div>
              </div>
            </VueDraggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, filter, find, findIndex, first, map, max, some } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import AddEditSwaypageModal from '@/components/AddEditSwaypageModal'
import EditPageSettingsModal from '@/components/Swaypage/EditPageSettingsModal'
import AddEditSwaypageLinkModal from '@/components/Swaypage/AddEditSwaypageLinkModal';
import { useModal } from 'vue-final-modal'

useEmbedly()

const route = useRoute()
const swaypageId = parseInt(route.params.id)
const pageId = parseInt(route.params.page)

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypagePagesByIdCached, 
  getSwaypageLinksByIdCached,
} = storeToRefs(swaypageStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller, getMeCached } = storeToRefs(usersStore)

const buyerSessionStore = useBuyerSessionStore()

const [swaypage, pages, linksSource, hasUser, isSeller, user, _] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  getSwaypageLinksByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  getMeCached.value(),
  buyerSessionStore.capturePageTimingIfAppropriate({ swaypageId, page: pageId })
])

const { cookies } = useAppConfig()
const linkedName = useCookie('linked-name', { domain: cookies.domain })
const anonymousId = useCookie('anonymous-id', { domain: cookies.domain })

if (!hasUser && !linkedName.value) {
  linkedName.value = route.query['sent-to']
}

if (!anonymousId.value && process.client) {
  anonymousId.value = crypto?.randomUUID
    ? crypto.randomUUID()
    : Math.floor(Math.random() * 1000000).toString()
}

const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(filter(pages, p => p.status === 'active'))

const canEdit = isSeller || page.canBuyerEdit

const metaTitle = `Discover ${swaypage.buyer}`
const metaDescription = `Learn more about what ${swaypage.buyer} has to offer`

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  ogTitle: metaTitle,
  ogDescription: metaDescription,
  twitterCard: 'summary',
  twitterTitle: metaTitle,
  twitterDescription: metaDescription,
})

const router = useRouter()
router.beforeEach(async () => {
  if (isDirty.value) {
    await debouncedSave.flush()
  }
})

// switch back to makeInternalSwaypageLink
const { makeNewSwaypageLink } = useSwaypageLinks()
setTimeout(() => router.replace({
  path: makeNewSwaypageLink(swaypage, page.id)
}), 100)

const keys = map(page?.body.sections, s => s.key || 0)
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

const body = ref({ sections: map(page?.body.sections, updateSection) })
const title = ref(page?.title)

if (process.client) {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) {
      debouncedSave.flush()
      e.preventDefault()
    }
  })
}

// TODO get this working now that we're doing this correctly!

// Ideally we could use a middleware (vs. a manual route guard) to implement
// the save on route, but middlewares can only be registered on pages. This
// would require us to make the current page a layout, and then implement
// these components as pages. This is probably worth doing when we do a larger
// layout/styling rework
const { submissionState: saveSubmissionState, submitFn: saveSubmitFn } = useSubmit(async () => {
  page.body = body.value
  page.title = title.value
  await swaypageStore.updatePage({ swaypageId, pageId, page })
  isDirty.value = false
})

const debouncedSave = debounce(saveSubmitFn, 2000, { leading: false, trailing: true })
const isDirty = ref(false)

watch(body.value, () => {
  isDirty.value = true
  debouncedSave()
})

watch(title, () => {
  isDirty.value = true
  debouncedSave()
})

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

function insertBlock ({ item, index }) {
  if (item === 'text') {
    newTextBlock(index)
  } else if (item === 'header') {
    newHeader(index)
  } else if (item === 'asset') {
    newAsset(index)
  } else if (item === 'ai-prompt') {
    newAiBlock(index)
  } else if (item === 'ai-prompt-template') {
    newAiTemplateBlock(index)
  }
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

function newAiBlock (index) {
  const newBlock = {
    type: "ai-prompt",
    prompt: "",
    text: "",
    key: nextKey++,
  }
  
  if (index) {
    body.value.sections.splice(index + 1, 0, newBlock)
  } else {
    body.value.sections.push(newBlock)
  }
}

function newAiTemplateBlock (index) {
  const newBlock = {
    type: "ai-prompt-template",
    prompt: "",
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

const { 
  open: openPageModal, 
  close: closePageModal, 
  patchOptions: patchPageModalOptions,
} = useModal({
  component: EditPageSettingsModal,
  attrs: {
    swaypageId,
    onClose () {
      closePageModal()
    },
  }
})

function openPageSettingsModal () {
  patchPageModalOptions({ attrs: { page }})
  openPageModal()
}

const { 
  open: openSwaypageModal,
  close: closeSwaypageModal,
  patchOptions: patchSwaypageModalOptions
} = useModal({
  component: AddEditSwaypageModal,
  attrs: {
    onClose () {
      closeSwaypageModal()
    }
  }
})

function openSwaypageSettingsModal() {
  patchSwaypageModalOptions({ attrs: { buyersphere: swaypage }})
  openSwaypageModal()
}

async function restorePage() {
  await swaypageStore.updatePage({
    swaypageId,
    pageId,
    page: { status: 'active' }
  })
  await swaypageStore.fetchSwaypagePages({ swaypageId, forceRefresh: true })
}

const links = ref(cloneDeep(linksSource))

async function saveLinkOrdering() {
  await swaypageStore.reorderLinks({ swaypageId, links })
}

const dbounceLinkReorder = debounce(saveLinkOrdering, 3000, { leading: false, trailing: true })

watch(links, () => {
  dbounceLinkReorder()
})

async function deleteLink(link) {
  const i = findIndex(links.value, l => l.id === link.id)
  links.value.splice(i, 1)

  await swaypageStore.deleteLink({
    swaypageId,
    linkId: link.id,
  })
}

const { 
  open: openSwaypageLinkModal,
  close: closeSwaypageLinkModal,
  patchOptions: patchSwaypageLinkModalOptions,
} = useModal({
  component: AddEditSwaypageLinkModal,
  attrs: {
    swaypageId: swaypage.id,
    async onClose (props) {
      if (props?.pageId) {
        refreshPages()
        await router.replace({ 
          path: makeNewSwaypageLink(swaypage, props.pageId)
        })
      }
      closeSwaypageLinkModal()
    }
  }
})

function createNewLink () {
  patchSwaypageLinkModalOptions({ attrs: { link: null }})
  openSwaypageLinkModal()
}

function editLink (link) {
  patchSwaypageLinkModalOptions({ attrs: { link, linkId: link.id }})
  openSwaypageLinkModal()
}

function trackLinkClick(linkText) {
  buyerSessionStore.capturePageEventIfAppropriate({
    eventType: "click-link",
    eventData: { linkText },
    swaypageId,
    page: pageId,
   })
}
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-border-dark rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
}

/* should be grid-cols-subgrid, but we need a newer tailwind */
.page-grid {
  @apply grid;
  grid-template-columns: 1fr minmax(150px, 220px);
}

.align-content-left {
  margin-left: calc(2.25rem + 2px);
}

.dropdown-item {
  @apply p-.5;
  
  &:hover {
    @apply hover:bg-gray-hover hover:px-[.5rem] hover:mx-[-.375rem]
      cursor-pointer;
  }
}

.rightbar-link {
  @apply py-2 w-full flex flex-row-reverse cursor-pointer items-center gap-3;
}
</style>
