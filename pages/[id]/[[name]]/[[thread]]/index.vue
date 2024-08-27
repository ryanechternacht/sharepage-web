<template>
  <div>
    <h2 v-if="!thread">
      There are no Threads in this Sharepage. Create a New Thread on the left
    </h2>
    <div class="min-w-0" v-else>
      <UAlert v-if="thread.status === 'archived'"
        title="This Thread is currently archived"
        color="orange"
        variant="subtle"
        :actions="[{
          label: 'Restore Thread',
          click: restoreThread,
          icon: 'i-heroicons-arrow-uturn-left',
          color: 'orange',
          variant: 'solid'
        }]" />
      <UAlert v-else-if="sharepage.isLocked"
        title="This Template is currently locked."
        description="This Template is currently locked because it is used by a campaign. You can make a copy of it if you want to edit it before using it in a new campaign."
        color="orange"
        variant="subtle"
        :actions="[{ 
          label: 'Clone as a Sharepage',
          click: () => cloneSharepage('deal-room'),
          icon: 'i-heroicons-document-duplicate',
          color: 'orange',
          variant: 'solid'
        }, { 
          label: 'Clone as a Template',
          click: () => cloneSharepage('template'),
          icon: 'i-heroicons-document-duplicate',
          color: 'orange',
          variant: 'solid' 
        }]" />

      <div class="h-[2.375rem] flex flex-row items-center gap-6">
        <div class="flex flex-row items-center">
          <template v-if="sharepage.quickCreateMadeBy">
            <UserAvatar
              class="-mr-.5 shrink-0"
              size="small"
              :user="{ firstName: sharepage.quickCreateMadeBy }" />
            <div v-if="sharepage.owner" class="ml-4 shrink-0 text-sm">
              Made by {{ sharepage.quickCreateMadeBy }}
            </div>
          </template>
          <template v-else-if="sharepage.owner">
            <UserAvatar
              class="-mr-.5 shrink-0"
              size="small"
              :user="sharepage.owner" />
            <div class="ml-4 shrink-0 text-sm">
              Made by {{ sharepage.owner.firstName }}
            </div>
          </template>
          <!-- TODO this text should be better -->
          <!-- <UserAvatar v-for="s in sharepage.sellerTeam" 
            class="-mr-.5 shrink-0"
            size="small"
            :user="s" />
          <div class="ml-4 shrink-0 text-sm">Made by
            <span v-for="(s, i) in sharepage.sellerTeam">{{ i > 1 ? "s.firstName, " : s.firstName }}</span>
          </div> -->
        </div>
        <div class="flex-grow" />
        <!-- <div>active</div> -->
        <!-- <SharepagePriorityTag v-if="isSeller"
          class="hidden sm:flex"
          :priority="sharepage.priority" /> -->
        <!-- <div v-if="canEdit" class="flex flex-row items-center gap-2 shrink-0">
          <template v-if="sharepage.isPublic">
            <UIcon class="icon-menu text-green-300" name="i-heroicons-eye" />
            <div class="subtext">Public</div>
          </template>
          <template v-else>
            <UIcon class="icon-menu text-orange-300" name="i-heroicons-eye-slash" />
            <div class="subtext">Private</div>
          </template>
        </div> -->
        <div v-if="canEdit" class="hidden sm:flex flex-row items-center gap-2">
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
        <UDropdown v-if="isSeller" :items="settingsMenu">
          <UIcon name="i-heroicons-ellipsis-vertical"
            class="-ml-4" />
        </UDropdown>
      </div>
      <div class="page-area">
        <div v-if="headerImage" class="w-[calc(100%+1rem)] group relative">
          <NuxtImg :src="headerImage?.url"
            class="-mx-2 -mt-2 object-cover object-center h-[7.5rem] w-full" />

          <!-- the manual margin left = align-content-left class but that class wasn't applying correctly as
               elements were dynamically created/removed -->
          <div v-if="canSellerEdit"
            class="flex flex-row items-center justify-between w-full px-[calc(2.25rem+2px)] absolute group-hover:flex hidden top-4">
            <USelectMenu v-model="headerImage" 
              class="w-full max-w-[30rem]"
              :searchable="searchUnsplash"
              :loading="unsplashSearchLoading"
              :searchable-lazy="true"
              searchable-placeholder="Search on Unsplash"
              :uiMenu="{
                base: 'grid grid-cols-4 max-h-none',
                input: 'col-span-4',
                option: { selected: 'pe-[inherit]',
                          selectedIcon: { wrapper: 'hidden' },
                          container: 'w-full' },
              }">
              <UButton variant="soft">Change Header</UButton>
              <template #option="{ option: { author, url } }">
                <div :key="url" class="overflow-hidden w-full">
                  <PhotoWithPlaceholder :src="url" />
                  <div class="text-[10px] text-gray-500 truncate">
                    By
                    <a :href="author.link" target="_blank" class="underline"
                      @click.self.prevent="navigateTo(author.link, { target: '_blank' })">
                      {{ author.name }}
                    </a>
                  </div>
                </div>
              </template>
            </USelectMenu>

            <UButton variant="soft"
              color="gray"
              icon="i-heroicons-x-mark"
              @click="headerImage = null" />
          </div>
        </div>
        <div v-else-if="canSellerEdit">
          <!-- the manual margin left = align-content-left class but that class wasn't applying correctly as
               elements were dynamically created/removed -->
          <USelectMenu
            v-model="headerImage" 
            class="top-4 ml-[calc(2.25rem+2px)] w-full max-w-[30rem]"
            :searchable="searchUnsplash"
            :loading="unsplashSearchLoading"
            :searchable-lazy="true"
            searchable-placeholder="Search on Unsplash"
            :uiMenu="{
              base: 'grid grid-cols-4',
              input: 'col-span-4',
              option: { selected: 'pe-[inherit]',
                        selectedIcon: { wrapper: 'hidden' },
                        container: 'w-full' },
            }">
            <UButton variant="soft"
              color="gray"
              icon="i-heroicons-plus">Add Header</UButton>
            <template #option="{ option: { author, url } }">
              <div :key="url" class="overflow-hidden w-full">
                <PhotoWithPlaceholder :src="url" />
                <div class="text-[10px] text-gray-500 truncate">
                  By
                  <a :href="author.link" target="_blank" class="underline"
                    @click.self.prevent="navigateTo(author.link, { target: '_blank' })">
                    {{ author.name }}
                  </a>
                </div>
              </div>
            </template>
          </USelectMenu>
        </div>

        <input v-if="canEdit"
          v-model="title"
          type="text"
          class="w-full p-0 pl-[calc(2.25rem+2px)] h1 my-6 border-0">
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
              :include-ai-prompt="sharepage.roomType !== 'template'"
              :include-ai-prompt-template="sharepage.roomType === 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)" />
            
            <EditorHeader v-if="section.type === 'header'"
              v-model="section.text"
              :readonly="!canEdit"
              :include-ai-prompt-template="sharepage.roomType === 'template'"
              :include-ai-prompt="sharepage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)" />

            <EditorAiPrompt v-if="section.type === 'ai-prompt'"
              :model-value="section"
              :readonly="!canEdit"
              :include-ai-prompt-template="sharepage.roomType === 'template'"
              :include-ai-prompt="sharepage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)"
              @update:model-value="s => updateItem(index, s)" />

            <EditorAiPromptTemplate v-if="section.type === 'ai-prompt-template'"
              v-model="section.prompt"
              :readonly="!canEdit"
              :include-ai-prompt-template="sharepage.roomType === 'template'"
              :include-ai-prompt="sharepage.roomType !== 'template'"
              @insert:item="({ item }) => insertBlock({ item, index })"
              @delete:item="removeItem(index)" />

            <EditorAsset v-if="section.type === 'asset'"
              :model-value="section"
              :readonly="!canEdit"
              :include-ai-prompt-template="sharepage.roomType === 'template'"
              :include-ai-prompt="sharepage.roomType !== 'template'"
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
              <UIcon class="text-gray-500 icon-menu" 
                name="i-heroicons-plus" />
              <div class="subtext">New</div>
            </div>
          </UDropdown>
        </div> 
   
        <div class="h-[2rem]" />

        <div class="w-full flex flex-row items-center justify-between pr-[.75rem]"
          :class="[canEdit ? 'pl-[1.75rem]' : 'pl-[.75rem]']">
          <div>
            <NuxtLink v-if="priorThread"
              :to="makeInternalSharepageLink(sharepage, priorThread.id)"
              class="subtext flex flex-row items-center">
              <UIcon class="mr-2" name="i-heroicons-chevron-left" />
              {{ priorThread.title }}
            </NuxtLink>
          </div>
          <div>
            <NuxtLink v-if="nextThread"
            :to="makeInternalSharepageLink(sharepage, nextThread.id)"
            class="subtext flex flex-row items-center">
              {{ nextThread.title }}
              <UIcon class="ml-2" name="i-heroicons-chevron-right" />
            </NuxtLink>
          </div>
        </div>

        <div class="h-[2rem]" /> <!-- bottom spacer -->
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, filter, findIndex, map, max, orderBy } = lodash_pkg;
import { useSharepagesStore } from '@/stores/sharepages'
import { useUsersStore } from '@/stores/users'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'

useEmbedly()

const route = useRoute()
const sharepageId = parseInt(route.params.id)

const sharepageStore = useSharepagesStore()
const { 
  getSharepageByIdCached, 
  getSharepageThreadsByIdCached, 
} = storeToRefs(sharepageStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const buyerSessionStore = useBuyerSessionStore()

const [sharepage, threads, hasUser, isSeller] = await Promise.all([
  getSharepageByIdCached.value(sharepageId),
  getSharepageThreadsByIdCached.value(sharepageId),
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
  ...sharepage.roomType !== 'template' ? [{
    label: 'AI Prompt',
    icon: 'i-heroicons-computer-desktop',
    click: () => newAiBlock(),
  }] : [], 
  // ...sharepage.roomType === 'template' ? [{
  //   label: 'AI Prompt',
  //   icon: 'i-heroicons-computer-desktop',
  //   click: () => newAiTemplateBlock(),
  // }] : [], 
  {
    label: 'Asset',
    icon: 'i-heroicons-link',
    click: () => newAsset(),
  }]
]

const activeThreads = computed(() => 
  activeThreads.value = orderBy(
    filter(threads,
      p => p.status === 'active'),
    ['ordering'],
    ['asc']
  ))

let threadId = parseInt(route.params.thread)
let thread
let threadIndex
// when we get here from a shareable link, the page id isn't in the url,
// so we'll pull it from the page we're sending them to
if (threadId) {
  threadIndex = findIndex(activeThreads.value, t => t.id === threadId)
  thread = activeThreads.value[threadIndex]
} else {
  thread = activeThreads.value[0]
  threadId = thread.id
  threadIndex = 0
}

const priorThread = threadIndex > 0 && activeThreads.value[threadIndex - 1]
const nextThread = activeThreads.value[threadIndex + 1]

buyerSessionStore.captureThreadTimingIfAppropriate({ sharepageId, thread: threadId })

const canSellerEdit = isSeller && !sharepage.isLocked
const canEdit = canSellerEdit || thread.canBuyerEdit

const metaTitle = `Discover ${sharepage.buyer}`
const metaDescription = `Learn more about what ${sharepage.buyer} has to offer`

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

const { makeInternalSharepageLink, makeSharepageThreadSettingsLink } = useSharepageLinks()
if (process.client) {
  setTimeout(() => 
    // TODO because we don't actually update routing, the link doesn't get
    // router-active-link set on it in the right sidebar
    // I think we could fix this by just manually setting it on that link
    // if no route param is set
    history.replaceState({}, '', makeInternalSharepageLink(sharepage, thread.id)), 
    100)
}

const settingsMenu = [[{
  label: 'Settings',
  to: makeInternalSharepageLink(sharepage, 'settings'),
}], [{
  label: 'Clone as Sharepage',
  click: () => cloneSharepage('deal-room')
}, {
  label: 'Clone as Template',
  click: () => cloneSharepage('template')
}]]

const keys = map(thread?.body.sections, s => s.key || 0)
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

const unsplashSearchLoading = ref(false)
const { apiFetch } = useNuxtApp()

const headerImage = ref(thread.headerImage)
async function searchUnsplash (query) {
  unsplashSearchLoading.value = true

  const queryWithFallback = query || "office"

  const { data } = await apiFetch(`/v0.1/search-unsplash/${queryWithFallback}`)
  unsplashSearchLoading.value = false

  return data.value
}

const body = ref({ sections: map(thread?.body.sections, updateSection) })
const title = ref(thread?.title)

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
  thread.body = body.value
  thread.title = title.value
  thread.headerImage = headerImage.value
  await sharepageStore.updateThread({ sharepageId, threadId, thread })
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

watch(headerImage, async (newValue) => {
  isDirty.value = true
  debouncedSave()

  apiFetch('/v0.1/download-unsplash', { 
    method: 'POST',
    body: { link: newValue.downloadLocation }})
})

function assetClick(link) {
  buyerActivityStore.captureBuyerActivity({
    buyersphereId: sharepageId,
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

async function restoreThread() {
  await sharepageStore.updateThread({
    sharepageId,
    threadId,
    thread: { status: 'active' }
  })
  // Ideally we'd just reload the sidebar, but I'm not sure the best way 
  // to propogate to the parent page, and this is rare enough that a hard
  // reload is fine
  reloadNuxtApp()
}

async function cloneSharepage(roomType) {
  const newId = await sharepageStore.cloneSharepage({ roomType, sharepageId: sharepage.id })
  sharepageStore.invalidateAllSharepageCache()
  await navigateTo(`/${newId}`)
}
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1 overflow-hidden;
  /* this is based on the current top nav height + header above */
  min-height: calc(100vh - 10.375rem);
}

.align-content-left {
  margin-left: calc(2.25rem + 2px);
}

.group-hover\:flex:has(> div[data-headlessui-state="open"]) {
  @apply flex;
}
</style>
