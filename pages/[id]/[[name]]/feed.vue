<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton
          icon="i-heroicons-link"
          @click="openShareModal">Share</UButton>
      </template>
    </TopNav>
    <div class="mt-6 layout-grid">
      <div class="mr-4">
        <div class="sticky top-8 min-h-[calc(100vh-6.5rem)] flex flex-col">
          <div class="header-grid">
            <img v-if="swaypage.roomType === 'deal-room'"
              :src="swaypage.buyerLogo"
              class="icon-header">
            <img v-else-if="swaypage.roomType === 'discovery-room'"
              :src="organization.logo"
              class="icon-header">
            <img v-else-if="swaypage.roomType === 'template'"
              :src="organization.logo"
              class="icon-header">
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

      <div>
        <div class="h-[2.375rem] flex flex-row items-center gap-6">
          <h1>Feed</h1>
          <div class="flex-grow" />
          <!-- <div>active</div> -->
          <div class="flex flex-row items-center gap-2">
            <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
            <div class="subtext">Internal Only</div>
          </div>
          <UDropdown :items="settingsMenu">
            <UIcon
              class="-ml-4"
              name="i-heroicons-ellipsis-vertical" />
          </UDropdown>
        </div>
        <div class="page-area">
          <div class="feed-grid">
            <h2 class="h-[3rem] flex flex-row items-center">Lead</h2>
            <h2 class="h-[3rem] flex flex-row items-center">Event</h2>
            <h2 class="h-[3rem] flex flex-row items-center">Event Time</h2>

            <template v-for="session in buyerSessions">
              <div class="cell">{{ session?.linkedName }}</div>
              <div class="cell">
                <div class="timing-grid">
                  <div v-for="timing in session.timings"
                    class="contents group">
                    <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                      <SwaypageTimingTag :timing="timing" />
                    </div>
                    <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                      <SwaypagePageTag :event="timing" />
                    </div>
                  </div>
                  <div v-for="event in session.events"
                    class="contents group">
                    <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                      <SwaypageEventTag :event="event" />
                    </div>
                    <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                      <SwaypagePageTag :event="event" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="cell">{{ prettyFormatDate(session.createdAt) }}</div>
            </template>
          </div>
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
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import EditSwaypageModal from '@/components/Modals/EditSwaypageModal'
import ShareLinkModal from '@/components/Modals/ShareLinkModal';
import AddEditPageModal from '@/components/Modals/AddEditPageModal'
import CreateSwaypageFromTemplateModal from '@/components/Modals/CreateSwaypageFromTemplateModal'
import lodash_pkg from 'lodash';
const { debounce, filter, findIndex, map, orderBy } = lodash_pkg;

definePageMeta({
  name: 'feed',
  middleware: ['enforce-seller'],
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

const swaypagesStore = useSwaypagesStore()
const {
  getSwaypageByIdCached, 
  getSwaypagePagesByIdCached, 
  getSwaypageBuyerSessionsByIdCached,
} = storeToRefs(swaypagesStore)

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [swaypage, pages, buyerSessions, isSeller, organization] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  getSwaypageBuyerSessionsByIdCached.value(swaypageId),
  isUserSeller.value(),
  getOrganizationCached.value(),
])

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

const { makeInternalSwaypageLink } = useSwaypageLinks()

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

const settingsMenu = [
  [{
    label: 'Edit Swaypage Settings',
    click: () => openSwaypageSettingsModal()
  }]
]

const modal = useModal()

function openSwaypageSettingsModal () {
  modal.open(EditSwaypageModal, {
    swaypage,
    async onClose () {
      modal.close()
    }
  })
}
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

.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
  overflow: hidden;
}

.feed-grid {
  @apply grid px-8 gap-x-8;
  grid-template-columns: auto 1fr auto;

  .cell {
    @apply py-2 relative flex flex-row items-center;
  
    &::after {
      @apply absolute bg-gray-200 h-[1px] w-screen;
      content: '';
      inset-inline-start: -5rem;
      inset-block-start: 0;
    }
  }
}

.timing-grid {
  @apply grid w-full -my-2;
  grid-template-columns: 1fr 1fr;
}
</style>
