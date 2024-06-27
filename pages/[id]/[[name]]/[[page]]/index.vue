<template>
  <div class="page-grid">
    <h2 v-if="!page">
      There are no Threads in this Swaypage. Create a New Thread on the left
    </h2>
    <div class="min-w-0" v-else>
      <UAlert v-if="page.status === 'archived'"
        title="This Thread is currently archived"
        color="orange"
        variant="subtle"
        :actions="[{ 
          label: 'Restore Thread', 
          click: restorePage,
          icon: 'i-heroicons-arrow-uturn-left',
          color: 'orange',
          variant: 'solid' 
        }]" />

      <div class="h-[2.375rem] flex flex-row items-center gap-6">
        <div class="flex flex-row items-center">
          <UserAvatar
            class="-mr-.5 shrink-0"
            size="small"
            :user="swaypage.owner" />
          <div v-if="swaypage.owner" class="ml-4 shrink-0 text-sm">
            Made by {{ swaypage.owner?.firstName }}
          </div>
          <!-- TODO this text should be better -->
          <!-- <UserAvatar v-for="s in swaypage.sellerTeam" 
            class="-mr-.5 shrink-0"
            size="small"
            :user="s" />
          <div class="ml-4 shrink-0 text-sm">Made by
            <span v-for="(s, i) in swaypage.sellerTeam">{{ i > 1 ? "s.firstName, " : s.firstName }}</span>
          </div> -->
        </div>
        <div class="flex-grow" />
        <!-- <div>active</div> -->
        <SwaypagePriorityTag v-if="isSeller"
          :priority="swaypage.priority" />
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
          <UIcon name="i-heroicons-document"
            class="icon-menu"
            :class="{'text-blue-500': saveSubmissionState === 'ready' || saveSubmissionState === 'submitted',
                      'text-orange-300': saveSubmissionState === 'submitting'}"
          />
          <div class="subtext w-[3.25rem]">
            {{ !isDirty ? "Saved" :
                saveSubmissionState === 'submitting' ? "Saving" :
                saveSubmissionState === 'submitted' ? "Saved" :
                saveSubmissionState === 'ready' ? "Changes" : "??" }}
          </div>
        </div>
        <UDropdown v-if="canEdit" :items="settingsMenu">
          <UIcon name="i-heroicons-ellipsis-vertical"
            class="-ml-4" />
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
          class="flex flex-col gap-4"
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
              :model-value="section"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)"
              @update:model-value="s => updateItem(index, s)" />

            <EditorAiPromptTemplate v-if="section.type === 'ai-prompt-template'"
              v-model="section.prompt"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)" />

            <EditorAsset v-if="section.type === 'asset'"
              :model-value="section"
              :readonly="!canEdit"
              :include-ai-prompt-template="swaypage.roomType === 'template'"
              :include-ai-prompt="swaypage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @click:item="assetClick(section.link)"
              @delete:item="removeItem(index)"
              @update:model-value="s => body.sections[index] = s" />
          </template>
        </VueDraggable>
        <div v-if="canEdit">
          <UDropdown :items="newBlocksMenu"
            :ui="{ item: { icon: { base: 'icon-submenu flex-shrink-0' }}}">
            <div class="align-content-left mt-2 flex flex-row gap-2 items-center cursor-pointer rounded-md py-2 px-1">
              <UIcon v-if="isSeller" 
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
          <div class="mt-[5.75rem] flex flex-col gap-2 items-end">
            <div class="body text-gray-500">Key Links</div>
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
                  <UDropdown v-if="isSeller" 
                    :items="makeLinkMenu(l)">
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
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, filter, find, findIndex, first, map, max } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import AddEditSwaypageLinkModal from '@/components/Modals/AddEditSwaypageLinkModal';

useEmbedly()

const route = useRoute()
const swaypageId = parseInt(route.params.id)

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypageChaptersByIdCached, 
  getSwaypageLinksByIdCached,
} = storeToRefs(swaypageStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const buyerSessionStore = useBuyerSessionStore()

const [swaypage, pages, linksSource, hasUser, isSeller] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypageChaptersByIdCached.value(swaypageId),
  getSwaypageLinksByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
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

let pageId = parseInt(route.params.page)
let page
// when we get here from a shareable link, the page id isn't in the url,
// so we'll pull it from the page we're sending them to
if (pageId) {
  page = find(pages, p => p.id === pageId)
} else {
  page = first(filter(pages, p => p.status === 'active'))
  pageId = page.id
}

buyerSessionStore.capturePageTimingIfAppropriate({ swaypageId, page: pageId })

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

const { makeInternalSwaypageLink, makeSwaypageChapterSettingsLink } = useSwaypageLinks()
if (process.client) {
  setTimeout(() => 
    history.replaceState({}, '', makeInternalSwaypageLink(swaypage, page.id)), 
    100)
}

const settingsMenu = [[{
  label: 'Thread Settings',
  to: makeSwaypageChapterSettingsLink(swaypage, pageId),
}, {
  label: 'Swaypage Settings',
  to: makeInternalSwaypageLink(swaypage, 'settings'),
}]]

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
  await swaypageStore.updateChapter({ swaypageId, chapterId: pageId, chapter: page })
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

async function restorePage() {
  await swaypageStore.updateChapter({
    swaypageId,
    chapterId: pageId,
    chapter: { status: 'active' }
  })
  // Ideally we'd just reload the sidebar, but I'm not sure the best way 
  // to propogate to the parent page, and this is rare enough that a hard
  // reload is fine
  reloadNuxtApp()
}

// This pattern is because VueDraggable needs its own object (links) to
// modify as ppl drag around. changes are sent to the store and then
// pushed back into vue draggable
// I'm honestly not sure why this works and just having VueDraggable
// use linksSouce directly doesn't, ¯\_(ツ)_/¯
const links = ref([])
function refreshLinks () {
  links.value = linksSource
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
