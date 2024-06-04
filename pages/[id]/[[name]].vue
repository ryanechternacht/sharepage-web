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
            <div class="mt-[2.25rem] mb-1 text-gray-500 body">Chapters</div>
            <VueDraggable
              v-model="activePages"
              ghost-class="ghost"
              :animation="200"
              :scroll="false"
              class="flex flex-col -ml-6"
              group="pages"
              handle=".drag-handle"
            >
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
              <div v-for="p in activePages"
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0">
                  <UDropdown :items="makePageMenu(p)">
                    <UIcon v-if="isSeller" 
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
                <div class="text-gray-500 body">New Chapter</div>
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

      <NuxtPage />
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import ShareLinkModal from '@/components/Modals/ShareLinkModal';
import AddEditPageModal from '@/components/Modals/AddEditPageModal'
import CreateSwaypageFromTemplateModal from '@/components/Modals/CreateSwaypageFromTemplateModal'
import lodash_pkg from 'lodash';
const { debounce, filter, findIndex, map, orderBy } = lodash_pkg;

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

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypagePagesByIdCached, 
} = storeToRefs(swaypageStore)
const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [swaypage, pages, isSeller, organization] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  isUserSeller.value(),
  getOrganizationCached.value(),
])

const { makeInternalSwaypageLink } = useSwaypageLinks()

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}

async function trackShare () {
  // TODO implement
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

const modal = useModal()

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
</style>
