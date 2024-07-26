<template>
  <div>
    <TopNav active-link="swaypages">
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
        <div class="sticky top-8 mb-2 md:mb-0 md:min-h-[calc(100vh-6.5rem)] flex flex-col">
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
            <template v-if="isSeller">
              <div v-if="swaypage.roomType === 'template'" class="subtext">Template</div>
              <div v-else class="subtext">{{ swaypage.subname }}</div>
            </template>
          </div>

          <div v-if="swaypage.roomType === 'template'">
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
                  :href="makeInternalSwaypageLink(swaypage, 'feed')"
                  class="sidebar-item">
                  <UIcon name="i-heroicons-signal" />
                  <div class="body">Feed</div>
                </NuxtLink>
              </div>
              <VueDraggable
                v-model="activePages"
                ghost-class="ghost"
                :animation="200"
                :scroll="false"
                group="pages"
                handle=".drag-handle"
              >
                <div v-for="p in activePages"
                  class="group/sidebar-item flex flex-row items-center">
                  <div class="w-[1.5rem] flex-shrink-0">
                    <UDropdown v-if="canSellerEdit"
                      :items="makePageMenu(p)">
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
              </VueDraggable>
              <div v-if="canSellerEdit" 
                class="ml-6 sidebar-item"
                @click="createNewPage">
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
              :items="archivedPagesMenu"
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
              :href="makeInternalSwaypageLink(swaypage, 'feed')"
              class="sidebar-item">
              <UIcon name="i-heroicons-signal" />
              <div class="body">Feed</div>
            </NuxtLink>
          </div>
          <VueDraggable
            v-model="activePages"
            ghost-class="ghost"
            :animation="200"
            :scroll="false"
            group="pages"
            handle=".drag-handle"
          >
            <div v-for="p in activePages"
              class="group/sidebar-item flex flex-row items-center">
              <div class="w-[1.5rem] flex-shrink-0">
                <UDropdown v-if="canSellerEdit"
                  :items="makePageMenu(p)">
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
          </VueDraggable>
          <div v-if="canSellerEdit" 
            class="ml-6 sidebar-item"
            @click="createNewPage">
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
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useOrganizationStore } from '@/stores/organization'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import ShareLinkModal from '@/components/Modals/ShareLinkModal';
import CreateChapterModal from '@/components/Modals/CreateChapterModal'
import CreateSwaypageFromTemplateModal from '@/components/Modals/CreateSwaypageFromTemplateModal'
import lodash_pkg from 'lodash';
const { concat, debounce, filter, findIndex, first, map, orderBy } = lodash_pkg;
import AddEditSwaypageLinkModal from '@/components/Modals/AddEditSwaypageLinkModal';

// We shouldn't need to re-render this component on navigation, but 
// for some reason, `pages` isn't getting updates from the store
// if we don't. I have no idea why, but re-rendering this component
// addresses it, ¯\_(ツ)_/¯ 
// The good news is most of this content is already
// fetched so it shouldn't be too tough to rerender. 
const route = useRoute()
definePageMeta({
  middleware: ['enforce-swaypage-visibility'],
  key: route => route.fullPath
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

const swaypageId = parseInt(route.params.id)

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypageChaptersByIdCached, 
  getSwaypageLinksByIdCached,
} = storeToRefs(swaypageStore)
const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [swaypage, pages, linksSource, isSeller, organization] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypageChaptersByIdCached.value(swaypageId),
  getSwaypageLinksByIdCached.value(swaypageId),
  isUserSeller.value(),
  getOrganizationCached.value(),
])

const { makeInternalSwaypageLink } = useSwaypageLinks()

const canSellerEdit = isSeller && !swaypage.isLocked

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}

let pageId = route.params.page && parseInt(route.params.page)
if (!pageId) {
  pageId = first(filter(pages, p => p.status === 'active')).id
}

const buyerSessionStore = useBuyerSessionStore()
async function trackShare () {
  buyerSessionStore.capturePageEventIfAppropriate({
    eventType: "click-share",
    swaypageId,
    page: pageId,
   })
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

async function saveLinkOrdering() {
  await swaypageStore.reorderLinks({ swaypageId, links })
}
const dbounceLinkReorder = debounce(saveLinkOrdering, 3000, { leading: false, trailing: true })
watch(links, () => {
  dbounceLinkReorder()
})

function trackLinkClick(linkText) {
  buyerSessionStore.capturePageEventIfAppropriate({
    eventType: "click-link",
    eventData: { linkText },
    swaypageId,
    page: pageId,
   })
}

async function deleteLink(link) {
  const i = findIndex(links.value, l => l.id === link.id)
  links.value.splice(i, 1)

  await swaypageStore.deleteLink({
    swaypageId,
    linkId: link.id,
  })
  refreshLinks()
}

const archivedPagesMenu = computed(() => {
  return [map(archivedPages.value, (p) => ({
    label: p.title,
    to: makeInternalSwaypageLink(swaypage, p.id),
  }))]
})

async function savePageOrdering() {
  await swaypageStore.reorderChapters({ swaypageId, chapters: activePages })
}

const debouncedPageReorder = debounce(savePageOrdering, 3000, { leading: false, trailing: true })

watch(activePages, () => {
  debouncedPageReorder()
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
  }], map(swaypage.templateCustomVariables, (variable, index) => ({
    name: variable,
    key: `field-${index + 1}`
  }))))

const modal = useModal()

async function createNewPage() {
  modal.open(CreateChapterModal, {
    swaypageId: swaypage.id,
    chapter: null,
    async onClose ({ chapterId }) {
      modal.close()
      refreshPages()
      await navigateTo(makeInternalSwaypageLink(swaypage, chapterId))
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

  await swaypageStore.updateChapter({
    swaypageId,
    chapterId: page.id,
    chapter: { status }
  })

  const currentPageId = parseInt(route.params.page)
  if (page.id === currentPageId) {
    await navigateTo(`/${swaypageId}`)
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
