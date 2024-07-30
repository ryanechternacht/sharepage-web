<template>
  <div>
    <TopNav active-link="sharepages">
      <template #action-button>
        <template v-if="sharepage.roomType === 'template'">
          <UButton icon="i-heroicons-document"
            @click="openCreateSharepageFromTemplate">
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
        <div class="sticky top-8 mb-2 md:mb-0 md:min-h-[calc(100vh-6.5rem)] flex flex-col">
          <div class="header-grid">
            <Logo v-if="sharepage.roomType === 'deal-room'"
              :src="sharepage.buyerLogo"
              class="icon-header" />
            <Logo v-else-if="sharepage.roomType === 'discovery-room'"
              :src="organization.logo"
              class="icon-header" />
            <Logo v-else-if="sharepage.roomType === 'template'"
              :src="organization.logo"
              class="icon-header" />
            <h2>{{ sharepage.buyer }}</h2>
            <div>
              <!-- TODO restore this icon -->
              <!-- <StarIcon class="icon-menu justify-self-center text-gray-400" /> -->
            </div>
            <template v-if="isSeller">
              <div v-if="sharepage.roomType === 'template'" class="subtext">Template</div>
              <div v-else class="subtext">{{ sharepage.subname }}</div>
            </template>
          </div>

          <div v-if="sharepage.roomType === 'template'">
            <div class="mt-[2.25rem] mb-2 text-gray-500 body">Variables</div>

            <div class="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 items-baseline">
              <template v-for="item in templateItems">
                <span class="subtext text-[.75rem]">{{ item.key }}</span>
                <span class="body">{{ item.name }}</span> 
              </template>
            </div>
          </div>

          <div class="hidden md:block">
            <div class="mt-[2.25rem] mb-1 text-gray-500 body">Threads</div>
            <div class="flex flex-col -ml-6">
              <div v-if="isSeller" 
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0" />
                <NuxtLink 
                  :href="makeInternalSharepageLink(sharepage, 'feed')"
                  class="sidebar-item">
                  <UIcon name="i-heroicons-signal" />
                  <div class="body">Feed</div>
                </NuxtLink>
              </div>
              <VueDraggable
                v-model="activeThreads"
                ghost-class="ghost"
                :animation="200"
                :scroll="false"
                group="pages"
                handle=".drag-handle"
              >
                <div v-for="p in activeThreads"
                  class="group/sidebar-item flex flex-row items-center">
                  <div class="w-[1.5rem] flex-shrink-0">
                    <UDropdown v-if="canSellerEdit"
                      :items="makeThreadMenu(p)">
                      <UIcon
                        class="icon-menu drag-handle cursor-pointer hidden group-hover/sidebar-item:block" 
                        name="i-heroicons-ellipsis-vertical" />
                    </UDropdown>
                  </div>
                  <NuxtLink 
                    :href="makeInternalSharepageLink(sharepage, p.id)"
                    class="sidebar-item">
                    <SharepageThreadTypeIcon :page-type="p.pageType" />
                    <div class="text-sm">{{ p.title }}</div>
                  </NuxtLink>
                </div>
              </VueDraggable>
              <div v-if="canSellerEdit" 
                class="ml-6 sidebar-item"
                @click="createNewThread">
                <UIcon name="i-heroicons-plus" class="text-gray-500" />
                <div class="text-gray-500 body">New Thread</div>
              </div>
            </div>

            <div v-if="canSellerEdit || links.length" class="mt-8">
              <div class="mb-1 text-gray-500 body">Key Links</div>
              <VueDraggable
                v-model="links"
                ghost-class="ghost"
                :animation="200"
                :scroll="false"
                class="flex flex-col -ml-6"
                group="pages"
                handle=".drag-handle"
              >
                <div v-for="l in links"
                  class="group/sidebar-item flex flex-row items-center">
                  <div class="w-[1.5rem] flex-shrink-0">
                    <UDropdown v-if="canSellerEdit" 
                      :items="makeLinkMenu(l)">
                      <UIcon
                        class="drag-handle icon-menu cursor-pointer hidden group-hover/sidebar-item:block"
                        name="i-heroicons-ellipsis-vertical" />
                    </UDropdown>
                  </div>
                  <a class="sidebar-item"
                    :href="l.linkUrl"
                    target="_blank"
                    @click="trackLinkClick(l.title)">
                    <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                    <div class="text-sm">{{ l.title }}</div>
                  </a>
                </div>
                
                <div v-if="canSellerEdit"
                  class="ml-6 sidebar-item"
                  @click="createNewLink">
                  <UIcon class="text-gray-500" name="i-heroicons-plus"/>
                  <div class="text-gray-500 body">New Link</div>
                </div>
              </VueDraggable>
            </div>
          </div>

          <div class="flex-grow" />

          <div class="hidden md:block mt-16 mb-4 w-full">
            <UDropdown v-if="isSeller" 
              :items="archivedThreadsMenu"
              :ui="{ item: { icon: { base: 'icon-submenu flex-shrink-0' }}}"
              :popper="{ placement: 'bottom-start' }">
              <div
                class="cursor-pointer flex flex-row gap-4 items-center">
                <UIcon name="i-heroicons-archive-box" class="text-gray-500" />
                <div class="text-gray-500">Archive</div>
              </div>
            </UDropdown>
          </div>
        </div>
      </div>

      <NuxtPage />

      <div class="md:hidden">
        <div class="mt-[2.25rem] mb-1 text-gray-500 body">Threads</div>
        <div class="flex flex-col -ml-6">
          <div v-if="isSeller" 
            class="group/sidebar-item flex flex-row items-center">
            <div class="w-[1.5rem] flex-shrink-0" />
            <NuxtLink 
              :href="makeInternalSharepageLink(sharepage, 'feed')"
              class="sidebar-item">
              <UIcon name="i-heroicons-signal" />
              <div class="body">Feed</div>
            </NuxtLink>
          </div>
          <VueDraggable
            v-model="activeThreads"
            ghost-class="ghost"
            :animation="200"
            :scroll="false"
            group="pages"
            handle=".drag-handle"
          >
            <div v-for="p in activeThreads"
              class="group/sidebar-item flex flex-row items-center">
              <div class="w-[1.5rem] flex-shrink-0">
                <UDropdown v-if="canSellerEdit"
                  :items="makeThreadMenu(p)">
                  <UIcon
                    class="icon-menu drag-handle cursor-pointer hidden group-hover/sidebar-item:block" 
                    name="i-heroicons-ellipsis-vertical" />
                </UDropdown>
              </div>
              <NuxtLink 
                :href="makeInternalSharepageLink(sharepage, p.id)"
                class="sidebar-item">
                <SharepageThreadTypeIcon :page-type="p.pageType" />
                <div class="text-sm">{{ p.title }}</div>
              </NuxtLink>
            </div>
          </VueDraggable>
          <div v-if="canSellerEdit" 
            class="ml-6 sidebar-item"
            @click="createNewThread">
            <UIcon name="i-heroicons-plus" class="text-gray-500" />
            <div class="text-gray-500 body">New Thread</div>
          </div>
        </div>

        <div v-if="canSellerEdit || links.length" class="mt-8">
          <div class="mb-1 text-gray-500 body">Key Links</div>
          <VueDraggable
            v-model="links"
            ghost-class="ghost"
            :animation="200"
            :scroll="false"
            class="flex flex-col -ml-6"
            group="pages"
            handle=".drag-handle"
          >
            <div v-for="l in links"
              class="group/sidebar-item flex flex-row items-center">
              <div class="w-[1.5rem] flex-shrink-0">
                <UDropdown v-if="canSellerEdit" 
                  :items="makeLinkMenu(l)">
                  <UIcon
                    class="drag-handle icon-menu cursor-pointer hidden group-hover/sidebar-item:block"
                    name="i-heroicons-ellipsis-vertical" />
                </UDropdown>
              </div>
              <a class="sidebar-item"
                :href="l.linkUrl"
                target="_blank"
                @click="trackLinkClick(l.title)">
                <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                <div class="text-sm">{{ l.title }}</div>
              </a>
            </div>
            
            <div v-if="canSellerEdit"
              class="ml-6 sidebar-item"
              @click="createNewLink">
              <UIcon class="text-gray-500" name="i-heroicons-plus"/>
              <div class="text-gray-500 body">New Link</div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { useUsersStore } from '@/stores/users'
import { useOrganizationStore } from '@/stores/organization'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import ShareLinkModal from '@/components/Modals/ShareLinkModal';
import CreateThreadModal from '@/components/Modals/CreateThreadModal'
import CreateSharepageFromTemplateModal from '@/components/Modals/CreateSharepageFromTemplateModal'
import lodash_pkg from 'lodash';
const { concat, debounce, filter, findIndex, first, map, orderBy } = lodash_pkg;
import AddEditSharepageLinkModal from '@/components/Modals/AddEditSharepageLinkModal';

// We shouldn't need to re-render this component on navigation, but 
// for some reason, `pages` isn't getting updates from the store
// if we don't. I have no idea why, but re-rendering this component
// addresses it, ¯\_(ツ)_/¯ 
// The good news is most of this content is already
// fetched so it shouldn't be too tough to rerender. 
const route = useRoute()
definePageMeta({
  middleware: ['enforce-sharepage-visibility'],
  key: route => route.fullPath
})

function makeThreadMenu(thread) {
  return [[
    {
      label: 'Archive',
      icon: "i-heroicons-archive-box",
      click: () => removeThread(thread, 'archived')
    }, {
      label: 'Delete',
      icon: "i-heroicons-trash",
      click: () => removeThread(thread, 'deleted')
    }
  ]]
}

const sharepageId = parseInt(route.params.id)

const sharepageStore = useSharepagesStore()
const { 
  getSharepageByIdCached, 
  getSharepageThreadsByIdCached, 
  getSharepageLinksByIdCached,
} = storeToRefs(sharepageStore)
const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [sharepage, threads, linksSource, isSeller, organization] = await Promise.all([
  getSharepageByIdCached.value(sharepageId),
  getSharepageThreadsByIdCached.value(sharepageId),
  getSharepageLinksByIdCached.value(sharepageId),
  isUserSeller.value(),
  getOrganizationCached.value(),
])

const { makeInternalSharepageLink } = useSharepageLinks()

const canSellerEdit = isSeller && !sharepage.isLocked

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}

let threadId = route.params.page && parseInt(route.params.page)
if (!threadId) {
  threadId = first(filter(threads, t => t.status === 'active')).id
}

const buyerSessionStore = useBuyerSessionStore()
async function trackShare () {
  buyerSessionStore.captureThreadEventIfAppropriate({
    eventType: "click-share",
    sharepageId,
    thread: threadId,
   })
}

const activeThreads = ref([])
const archivedThreads = ref([])

function refreshThreads () {
  activeThreads.value = orderBy(
    filter(threads,
      p => p.status === 'active'),
    ['ordering'],
    ['asc']
  )

  archivedThreads.value = orderBy(
    filter(threads,
      p => p.status === 'archived'),
    ['ordering'],
    ['asc']
  )
}
refreshThreads()

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

function createNewLink () {
  modal.open(AddEditSharepageLinkModal, {
    sharepageId: sharepage.id,
    link: null,
    async onClose () {
      modal.close()
      refreshLinks()
    }
  })
}

function editLink (link) {
  modal.open(AddEditSharepageLinkModal, {
    sharepageId: sharepage.id,
    link,
    async onClose () {
      modal.close()
    }
  })
}

async function saveLinkOrdering() {
  await sharepageStore.reorderLinks({ sharepageId, links })
}
const dbounceLinkReorder = debounce(saveLinkOrdering, 3000, { leading: false, trailing: true })
watch(links, () => {
  dbounceLinkReorder()
})

function trackLinkClick(linkText) {
  buyerSessionStore.captureThreadEventIfAppropriate({
    eventType: "click-link",
    eventData: { linkText },
    sharepageId,
    thread: threadId,
   })
}

async function deleteLink(link) {
  const i = findIndex(links.value, l => l.id === link.id)
  links.value.splice(i, 1)

  await sharepageStore.deleteLink({
    sharepageId,
    linkId: link.id,
  })
  refreshLinks()
}

const archivedThreadsMenu = computed(() => {
  return [map(archivedThreads.value, (p) => ({
    label: p.title,
    to: makeInternalSharepageLink(sharepage, p.id),
  }))]
})

async function saveThreadOrdering() {
  await sharepageStore.reorderThreads({ sharepageId, threads: activeThreads })
}

const debouncedThreadReorder = debounce(saveThreadOrdering, 3000, { leading: false, trailing: true })

watch(activeThreads, () => {
  debouncedThreadReorder()
})

const templateItems = computed(() => 
  concat([
  {
    name: 'Account Name',
    key: 'account-name',
  },
  {
    name: 'First Name',
    key: 'first-name',
  },
  {
    name: 'Last Name',
    key: 'last-name',
  },
  {
    name: 'Email',
    key: 'email',
  },
  {
    name: 'Domain',
    key: 'domain',
  }], map(sharepage.templateCustomVariables, (variable, index) => ({
    name: variable,
    key: `field-${index + 1}`
  }))))

const modal = useModal()

async function createNewThread() {
  modal.open(CreateThreadModal, {
    sharepageId: sharepage.id,
    thread: null,
    async onClose ({ threadId }) {
      modal.close()
      refreshThreads()
      await navigateTo(makeInternalSharepageLink(sharepage, threadId))
    }
  })
}

function openShareModal () {
  modal.open(ShareLinkModal, {
    sharepage: sharepage,
    async onClose () {
      modal.close()
    }
  })
}

function openCreateSharepageFromTemplate () {
  modal.open(CreateSharepageFromTemplateModal, {
    templateId: sharepage.id,
    async onClose (props) {
      modal.close()
      if (props?.sharepageId) {
        await navigateTo(`/${props.sharepageId}`)
      }
    }
  })
}

async function removeThread(page, status) {
  const i = findIndex(activeThreads.value,
    p => p.id === page.id)
  activeThreads.value.splice(i, 1)

  await sharepageStore.updateThread({
    sharepageId,
    threadId: page.id,
    thread: { status }
  })

  const currentThreadId = parseInt(route.params.page)
  if (page.id === currentThreadId) {
    await navigateTo(`/${sharepageId}`)
  }
}
</script>

<style lang="postcss" scoped>
.layout-grid {
  @apply mx-8;
}

@screen md {
  .layout-grid {
    @apply grid;
    grid-template-columns: minmax(20%, 370px) minmax(580px, 1fr);
  }
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
</style>
