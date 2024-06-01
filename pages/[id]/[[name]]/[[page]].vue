<template>
  <div>
    <TopNav>
      <template #action-button>
        <template v-if="swaypage.roomType === 'template'">
          <UButton icon="i-heroicons-document"
            @click="openCreateSwaypageFromTemplate">
            Create from Template
          </UButton>
        </template>
        <template v-else>
          <UButton v-if="isSeller"
            icon="i-heroicons-link"
            @click="openShareModal">Share</UButton>
          <CopyToClipboardButton v-else
            :url="linkToPage"
            @click="trackShare" />
        </template>
      </template>
    </TopNav>
    <div class="mt-6 layout-grid">
      <div class="mr-4">
        <div class="sticky top-8 min-h-[calc(100vh-6.5rem)] flex flex-col">
          <div class="header-grid">
            <Logo v-if="swaypage.roomType === 'deal-room'"
              :src="swaypage.buyerLogo"
              class="icon-header" />
            <Logo v-else-if="swaypage.roomType === 'discovery-room'"
              :src="organization.logo"
              class="icon-header" />
            <Logo v-else-if="swaypage.roomType === 'template'"
              :src="organization.logo"
              class="icon-header" />
            <h2>{{ swaypage.buyer }}</h2>
            <div>
              <!-- TODO restore this icon -->
              <!-- <StarIcon class="icon-menu justify-self-center text-gray-400" /> -->
            </div>
            <div v-if="swaypage.roomType === 'template'" class="subtext">Template</div>
            <div v-else class="subtext">{{ swaypage.subname }}</div>
          </div>

          <div v-if="swaypage.roomType === 'template'">
            <div class="mt-[2.25rem] mb-1 text-gray-500">Template Items</div>
            
            <div class="flex flex-col gap-1">
              <div v-for="item in templateItems">
                {{ item.name }} 
                <span class="subtext text-[.75rem]">{{ item.key }}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="mt-[2.25rem] mb-1 text-gray-500 body">Pages</div>
            <VueDraggable
              v-model="activePages"
              ghost-class="ghost"
              :animation="200"
              :scroll="false"
              class="flex flex-col -ml-6"
              group="pages"
              handle=".drag-handle"
            >
              <div v-if="isSeller && swaypage.roomType !== 'template'"
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0" />
                <NuxtLink 
                  :href="makeInternalSwaypageLink(swaypage, 'feed')"
                  class="sidebar-item">
                  <UIcon name="i-heroicons-signal" />
                  <div class="body">Feed</div>
                </NuxtLink>
              </div>
              <div v-for="p in activePages"
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0">
                  <UDropdown v-if="isSeller" :items="makePageMenu(p)">
                    <UIcon
                      class="icon-menu drag-handle cursor-pointer hidden group-hover/sidebar-item:block" 
                      name="i-heroicons-ellipsis-vertical" />
                  </UDropdown>
                </div>
                <NuxtLink 
                  :href="makeInternalSwaypageLink(swaypage, p.id)"
                  class="sidebar-item">
                  <SwaypagePageTypeIcon :page-type="p.pageType" />
                  <div class="text-sm">{{ p.title }}</div>
                </NuxtLink>
              </div>

              <div v-if="isSeller" 
                class="ml-6 sidebar-item"
                @click="createNewPage">
                <UIcon name="i-heroicons-plus" class="text-gray-500" />
                <div class="text-gray-500 body">New Page</div>
              </div>
            </VueDraggable>
          </div>

          <div class="flex-grow" />

          <div class="mt-16 mb-4 w-full">
            <UDropdown :items="archivedPagesMenu"
            :ui="{ item: { icon: { base: 'icon-submenu flex-shrink-0' }}}"
            :popper="{ placement: 'bottom-start' }">
              <div v-if="isSeller" 
                class="cursor-pointer flex flex-row gap-4 items-center">
                <UIcon name="i-heroicons-archive-box" class="text-gray-500" />
                <div class="text-gray-500">Archive</div>
              </div>
            </UDropdown>
          </div>
        </div>
      </div>

      <div class="page-grid">
        <h2 v-if="!page">
          There are no pages in this Swaypage. Create a New Page on the left
        </h2>
        <div v-else>
          <div v-if="page.status === 'archived'"
            class="p-2 rounded-md bg-gray-200 flex flex-row items-center">
            <div>This page is currently archived.</div>
            <div class="flex-grow" />
            <UButton icon="i-heroicons-arrow-uturn-left"
              @click="restorePage">
              Restore Page
            </UButton>
          </div>
          <div class="h-[2.375rem] flex flex-row items-center gap-6">
            <div class="flex flex-row items-center">
              <UserAvatar v-for="s in swaypage.sellerTeam" 
                class="-mr-.5 shrink-0"
                size="small"
                :user="s" />
              <!-- TODO this text should be better -->
              <div class="ml-4 shrink-0 text-sm">Made by
                <span v-for="(s, i) in swaypage.sellerTeam">{{ i > 1 ? "s.firstName, " : s.firstName }}</span>
              </div>
            </div>
            <div class="flex-grow" />
            <!-- <div>active</div> -->
            <div v-if="canEdit" class="flex flex-row items-center gap-2 shrink-0">
              <template v-if="swaypage.isPublic">
                <UIcon class="icon-menu text-green-300" name="i-heroicons-eye" />
                <div class="subtext">Public</div>
              </template>
              <template v-else>
                <UIcon class="icon-menu text-orange-300" name="i-heroicons-eye-slash" />
                <div class="subtext">Private</div>
              </template>
            </div>
            <div v-if="canEdit" class="flex flex-row items-center gap-2">
              <!-- Putting the :class directly on the icon prevented it from updating dynamically -->
              <div :class="{'text-blue-500': saveSubmissionState === 'ready' || saveSubmissionState === 'submitted',
                            'text-orange-300': saveSubmissionState === 'submitting'}">
                <UIcon class="icon-menu" name="i-heroicons-document" />
              </div>  
              <div class="subtext w-[3.25rem]">
                {{ !isDirty ? "Saved" :
                    saveSubmissionState === 'submitting' ? "Saving" :
                    saveSubmissionState === 'submitted' ? "Saved" :
                    saveSubmissionState === 'ready' ? "Changes" : "??" }}
              </div>
            </div>
            <UDropdown v-if="isSeller" :items="settingsMenu">
              <UIcon
                class="-ml-4"
                name="i-heroicons-ellipsis-vertical" />
            </UDropdown>
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
                  @insert:item="({ item }) => insertBlock({ item, index })"
                  @delete:item="removeItem(index)" />
                
                <EditorHeader v-if="section.type === 'header'"
                  v-model="section.text"
                  :readonly="!canEdit"
                  :include-ai-prompt-template="swaypage.roomType === 'template'"
                  :include-ai-prompt="swaypage.roomType !== 'template'"
                  @insert:item="({ item }) => insertBlock({ item, index })"
                  @delete:item="removeItem(index)" />

                <EditorAiPrompt v-if="section.type === 'ai-prompt'"
                  :modelValue="section"
                  :readonly="!canEdit"
                  :include-ai-prompt-template="swaypage.roomType === 'template'"
                  :include-ai-prompt="swaypage.roomType !== 'template'"
                  @insert:item="({ item }) => insertBlock({ item, index })"
                  @delete:item="removeItem(index)"
                  @update:modelValue="s => updateItem(index, s)" />

                <EditorAiPromptTemplate v-if="section.type === 'ai-prompt-template'"
                  v-model="section.prompt"
                  :readonly="!canEdit"
                  :include-ai-prompt-template="swaypage.roomType === 'template'"
                  :include-ai-prompt="swaypage.roomType !== 'template'"
                  @insert:item="({ item }) => insertBlock({ item, index })"
                  @delete:item="removeItem(index)" />

                <EditorAsset v-if="section.type === 'asset'"
                  v-model="section.link"
                  :readonly="!canEdit"
                  :include-ai-prompt-template="swaypage.roomType === 'template'"
                  :include-ai-prompt="swaypage.roomType !== 'template'"
                  @insert:item="({ item }) => insertBlock({ item, index })"
                  @click:item="assetClick(section.link)"
                  @delete:item="removeItem(index)" />
              </template>
            </VueDraggable>
            <div v-if="canEdit">
              <UDropdown v-if="isSeller" :items="newBlocksMenu"
                :ui="{ item: { icon: { base: 'icon-submenu flex-shrink-0' }}}">
                <div class="align-content-left mt-2 flex flex-row gap-2 items-center cursor-pointer rounded-md py-2 px-1">
                  <UIcon
                    class="text-gray-500 icon-menu" 
                    name="i-heroicons-plus" />
                  <div class="subtext">New</div>
                </div>
              </UDropdown>
            </div>

            <div class="h-[2rem]" /> <!-- bottom spacer -->
          </div>
        </div>
        <div>
          <div class="ml-2">
            <div class="sticky top-[5.75rem]">
              <div class="mt-[5.75rem] flex flex-col gap-4 items-end">
                <div class="text-gray-500 text-sm">Key Links</div>
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
                      <UDropdown v-if="isSeller" :items="makeLinkMenu(l)">
                        <UIcon
                          class="drag-handle icon-menu cursor-pointer hidden group-hover/link-item:block"
                          name="i-heroicons-ellipsis-vertical" />
                      </UDropdown>
                    </div>
                    <a class="rightbar-link"
                      :href="l.linkUrl"
                      target="_blank"
                      @click="trackLinkClick(l.title)">
                      <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                      <div class="text-right text-sm">{{ l.title }}</div>
                    </a>
                  </div>
                  
                  <div v-if="isSeller"
                    class="rightbar-link"
                    @click="createNewLink">
                    <UIcon class="icon-menu text-gray-500 mr-6" 
                      name="i-heroicons-plus"/>
                    <div class="text-gray-500 text-right text-sm">New Link</div>
                  </div>
                </VueDraggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { clone, cloneDeep, debounce, filter, find, findIndex, first, map, max, orderBy } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useOrganizationStore } from '@/stores/organization'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import ShareLinkModal from '@/components/Modals/ShareLinkModal';
import EditSwaypageModal from '@/components/Modals/EditSwaypageModal'
import CreateSwaypageFromTemplateModal from '@/components/Modals/CreateSwaypageFromTemplateModal'
import AddEditPageModal from '@/components/Modals/AddEditPageModal'
import AddEditSwaypageLinkModal from '@/components/Modals/AddEditSwaypageLinkModal';

// We used to use a nested page approach to extract the largely
// duplicative page layout logic in [[page]].vue and feed.vue. however
// this ran into a very annoying bug where the tiptap areas would be
// double mounted. It appears this is a vue bug according to the nuxt 
// documentation on transitions. (https://github.com/vuejs/core/issues/5513). 
// In theory, this bug was fixed in 3.4.8ish, but it's still a problem for
// tiptap anyway. so I copied that logic into both [[page]].vue and feed.vue
// and i'm just sad about it :()

useEmbedly()

definePageMeta({
  middleware: ['enforce-swaypage-visibility'],
})

function makePageMenu(page) {
  return [[
    {
      label: 'Archive',
      icon: "i-heroicons-archive-box",
      click: () => removePage(page, 'archived')
    }, {
      label: 'Delete',
      icon: "i-heroicons-trash",
      click: () => removePage(page, 'deleted')
    }
  ]]
}

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
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const buyerSessionStore = useBuyerSessionStore()

const [swaypage, pages, linksSource, hasUser, isSeller, _, organization] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  getSwaypageLinksByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  buyerSessionStore.capturePageTimingIfAppropriate({ swaypageId, page: pageId }),
  getOrganizationCached.value()
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

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}

async function trackShare () {
  // TODO implement
}

const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(filter(pages, p => p.status === 'active'))

const router = useRouter()
const { makeInternalSwaypageLink } = useSwaypageLinks()
if (process.client) {
  setTimeout(() => 
    history.replaceState({}, '', makeInternalSwaypageLink(swaypage, page.id)), 
    100)
}



const newBlocksMenu = [
  [{
    label: 'Header',
    icon: 'i-heroicons-language',
    click: () => newHeader(),
  }, {
    label: 'Text Block',
    icon: 'i-heroicons-bars-3-bottom-left',
    click: () => newTextBlock(),
  }, 
  ...swaypage.roomType !== 'template' ? [{
    label: 'AI Prompt',
    icon: 'i-heroicons-computer-desktop',
    click: () => newAiBlock(),
  }] : [], 
  ...swaypage.roomType === 'template' ? [{
    label: 'AI Prompt',
    icon: 'i-heroicons-computer-desktop',
    click: () => newAiTemplateBlock(),
  }] : [], {
    label: 'Asset',
    icon: 'i-heroicons-link',
    click: () => newAsset(),
  }]
]

function makeLinkMenu(link) {
  return [[
    {
      label: 'Edit',
      icon: "i-heroicons-pencil-square",
      click: () => editLink(link)
    }, {
      label: 'Delete',
      icon: "i-heroicons-trash",
      click: () => deleteLink(link)
    }
  ]]
}

const activePages = ref([])
const archivedPages = ref([])

function refreshPages () {
  activePages.value = orderBy(
    filter(pages, 
      p => p.status === 'active'),
    ['ordering'],
    ['asc']
  )

  archivedPages.value = orderBy(
    filter(pages, 
      p => p.status === 'archived'),
    ['ordering'],
    ['asc']
  )
}
refreshPages()

const archivedPagesMenu = computed(() => {
  return [map(archivedPages.value, (p) => ({
    label: p.title,
    to: makeInternalSwaypageLink(swaypage, p.id),
  }))]
})

async function savePageOrdering() {
  await swaypageStore.reorderPages({ swaypageId, pages: activePages })
}

const debouncedPageReorder = debounce(savePageOrdering, 3000, { leading: false, trailing: true })

watch(activePages, () => {
  debouncedPageReorder()
})

function createNewPage() {
  modal.open(AddEditPageModal, {
    swaypageId: swaypage.id,
    page: null,
    async onClose () {
      modal.close()
      refreshPages()
    }
  })
}

function openShareModal () {
  modal.open(ShareLinkModal, {
    swaypage,
    async onClose () {
      modal.close()
    }
  })
}

function openCreateSwaypageFromTemplate () {
  modal.open(CreateSwaypageFromTemplateModal, {
    templateId: swaypage.id,
    async onClose (props) {
      modal.close()
      if (props?.swaypageId) {
        await navigateTo(`/${props.swaypageId}`)
      }
    }
  })
}

async function removePage(page, status) {
  const i = findIndex(activePages.value,
    p => p.id === page.id)
  activePages.value.splice(i, 1)

  await swaypageStore.updatePage({
    swaypageId,
    pageId: page.id,
    page: { status }
  })

  const currentPageId = parseInt(route.params.page)
  if (page.id === currentPageId) {
    await navigateTo(`/${swaypageId}`)
  }
  refreshPages()
}

const templateItems = [
  {
    name: 'First Name',
    key: 'first-name',
  },
  {
    name: 'Last Name',
    key: 'last-name',
  },
  {
    name: 'Company',
    key: 'company',
  },
  {
    name: 'Data 1',
    key: 'data-1',
  },
  {
    name: 'Data 2',
    key: 'data-2',
  },
  {
    name: 'Data 3',
    key: 'data-3',
  },
]

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

router.beforeEach(async () => {
  if (isDirty.value) {
    await debouncedSave.flush()
  }
})

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
  }

  if (s.type === 'simple-list') {
    s.type = 'text'
    s.text = (s.title ? `<p>${s.title}</p>` : '')
      + s.body.question
      + '<ul>' 
      + map(s.body.choices, c => `<li>${c.text}</li>`).join('')
      + '</ul>'
  }

  if (s.type === 'simple-asset') {
    s.type = 'asset'
    s.link = s.body.asset.link
  }

  // remove old form of these objects
  delete s.body

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

  addBlock(newBlock, index)
}

function newHeader (index) {
  const newBlock = {
    type: "header",
    text: "",
    key: nextKey++,
  }

  addBlock(newBlock, index)
}

function newAiBlock (index) {
  const newBlock = {
    type: "ai-prompt",
    prompt: "",
    output: "",
    key: nextKey++,
  }
  
  addBlock(newBlock, index)
}

function newAiTemplateBlock (index) {
  const newBlock = {
    type: "ai-prompt-template",
    prompt: "",
    key: nextKey++,
  }
  
  addBlock(newBlock, index)
}

function newAsset (index) {
  const newBlock = {
    type: "asset",
    link: "",
    key: nextKey++,
  }
  
  addBlock(newBlock, index)
}

function addBlock (block, index) {
  if (index !== undefined) {
    body.value.sections.splice(index + 1, 0, block)
  } else {
    body.value.sections.push(block)
  }
}

function updateItem(index, newSection) {
  body.value.sections[index] = newSection
}

const modal = useModal()

function openPageSettingsModal () {
  modal.open(AddEditPageModal, {
    swaypageId: swaypage.id,
    page,
    async onClose () {
      modal.close()
    }
  })
}

function createNewLink () {
  modal.open(AddEditSwaypageLinkModal, {
    swaypageId: swaypage.id,
    link: null,
    async onClose () {
      modal.close()
      refreshLinks()
    }
  })
}

function editLink (link) {
  modal.open(AddEditSwaypageLinkModal, {
    swaypageId: swaypage.id,
    link,
    async onClose () {
      modal.close()
    }
  })
}

function openSwaypageSettingsModal () {
  modal.open(EditSwaypageModal, {
    swaypage,
    async onClose () {
      modal.close()
    }
  })
}

const settingsMenu = [
  [{
    label: 'Edit Page Settings',
    click: () => openPageSettingsModal()
  }, {
    label: 'Edit Swaypage Settings',
    click: () => openSwaypageSettingsModal()
  }]
]

async function restorePage() {
  await swaypageStore.updatePage({
    swaypageId,
    pageId,
    page: { status: 'active' }
  })
  // Ideally we'd just reload the sidebar, but I'm not sure the best way 
  // to propogate to the parent page, and this is rare enough that a hard
  // reload is fine
  reloadNuxtApp()
}

const links = ref([])
function refreshLinks () {
  links.value = clone(linksSource)
}
refreshLinks()

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
  refreshLinks()
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
.layout-grid {
  @apply grid mx-8;
  grid-template-columns: minmax(150px, 250px) 1fr;
}

.header-grid {
  @apply grid items-center gap-x-2 gap-y-2;
  grid-template-columns: auto 1fr;
}

.sidebar-item {
  @apply w-full py-2 my-1 cursor-pointer flex flex-row gap-4 items-center;

  &.router-link-active {
    @apply bg-gray-200 rounded-md py-3 my-0 px-2 -mx-2;

    .text-sm {
      @apply font-semibold;
    }
  }
}
.show-menu :deep() > * {
  @apply block;
}

.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height */
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

.rightbar-link {
  @apply py-2 w-full flex flex-row-reverse cursor-pointer items-center gap-3;
}
</style>
