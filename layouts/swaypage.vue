<template>
  <div>
    <TopNavNew>
      <template #action-button>
        <SpButton v-if="isSeller"
          @click="openShareModal">
          <template #icon>
            <Link2Icon class="icon-menu" />
          </template>
          Share
        </SpButton>
        <CopyToClipboardNew v-else
          :url="linkToPage"
          :swaypage-id="swaypage.id"
          :page="swaypagePage" />
      </template>
    </TopNavNew>
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
            <h2>{{ swaypage.buyer }}</h2>
            <div>
              <!-- TODO restore this icon -->
              <!-- <StarIcon class="icon-menu justify-self-center text-gray-medium" /> -->
            </div>
            <div class="subtext">{{ swaypage.subname }}</div>
          </div>
          <div>
            <div class="mt-[2.25rem] mb-1 text-gray-medium">Pages</div>
            <!-- <div class="flex flex-col -ml-6"> -->
            <VueDraggable
              v-model="activePages"
              ghost-class="ghost"
              :animation="200"
              :scroll="false"
              class="flex flex-col -ml-6 h-full"
              group="pages"
              handle=".drag-handle"
            >
              <div v-if="isSeller" 
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0" />
                <NuxtLink 
                  :href="makeNewSwaypageLink(swaypage, 'feed')"
                  class="sidebar-item">
                  <RadioIcon />
                  <div>Feed</div>
                </NuxtLink>
              </div>
              <div v-for="p in activePages"
                class="group/sidebar-item flex flex-row items-center">
                <div class="w-[1.5rem] flex-shrink-0">
                  <dropdown-menu
                    :overlay="false"
                    with-dropdown-closer>
                    <template #trigger>
                      <MoreVerticalIcon v-if="isSeller"
                        class="icon-menu drag-handle cursor-pointer hidden group-hover/sidebar-item:block" />
                    </template>
                    <template #body>
                      <div class="dropdown-menu">
                        <div class="dropdown-item"
                          dropdown-closer
                          @click="removePage(p, 'archived')">Archive</div>
                        <div class="dropdown-item"
                          dropdown-closer
                          @click="removePage(p, 'deleted')">Delete</div>
                      </div>
                    </template>
                  </dropdown-menu>
                </div>
                <NuxtLink 
                  :href="makeNewSwaypageLink(swaypage, p.id)"
                  class="sidebar-item">
                  <FileIcon v-if="p.pageType === 'general'" class="icon-menu" />
                  <ArrowRightCircleIcon v-else-if="p.pageType === 'follow-up'" class="icon-menu" />
                  <MapIcon v-else-if="p.pageType === 'guide'" class=" icon-menu" />
                  <MessageCircleIcon v-else-if="p.pageType === 'discussion'" class="icon-menu" />
                  <FileTextIcon v-else-if="p.pageType === 'business-case'" class="icon-menu" />
                  <ClipboardIcon v-else-if="p.pageType === 'notes'" class="icon-menu" />
                  <div>{{ p.title }}</div>
                </NuxtLink>
              </div>

              <div v-if="isSeller" 
                class="ml-6 sidebar-item"
                @click="createNewPage">
                <PlusSquareIcon class="text-gray-medium" />
                <div class="text-gray-medium">New Page</div>
              </div>
            </VueDraggable>
            <!-- </div> -->
          </div>

          <div class="flex-grow" />

          <div class="mt-16 mb-4 w-full">
            <dropdown-menu
              :overlay="false"
              with-dropdown-closer
              dropup>
              <template #trigger>
                <div v-if="isSeller" 
                  class="cursor-pointer flex flex-row gap-4 items-center">
                  <ArchiveIcon class="text-gray-medium" />
                  <div class="text-gray-medium">Archive</div>
                </div>
              </template>
              <template #body>
                <div class="dropdown-menu">
                  <NuxtLink v-for="p in archivedPages" 
                    class="dropdown-item"
                    :href="makeNewSwaypageLink(swaypage, p.id)">{{ p.title }}</NuxtLink>
                </div>
              </template>
            </dropdown-menu>
          </div>
        </div>
      </div>

      <slot />
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
import ShareLinkModal from '@/components/ShareLinkModal';
import AddSwaypagePageModal from '@/components/Swaypage/AddSwaypagePageModal'
import { useModal } from 'vue-final-modal'
import lodash_pkg from 'lodash';
const { debounce, cloneDeep, filter, findIndex, orderBy } = lodash_pkg;

const route = useRoute()
console.log('route', route)
const swaypageId = parseInt(route.params.id)
const swaypagePage = route.params.page

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypagePagesByIdCached, 
} = storeToRefs(swaypageStore)
const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [swaypage, pages, hasUser, isSeller, organization] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  getOrganizationCached.value(),
])

const router = useRouter()
// switch back to makeInternalSwaypageLink
const { makeNewSwaypageLink } = useSwaypageLinks()

const linkToPage = useRequestURL().href

// TODO for making a new "sharing" modal
// const path = props.recipient
//   ? makePersonalizedExternalSwaypageLink(props.swaypageShortcode, props.recipient)
//   : makeExternalSwaypageLink(props.swaypageShortcode, props.companyName)

// const u = useRequestURL()
// const urlBase =  u.protocol + '//' + u.host;

// const url = new URL(path, urlBase)

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

async function savePageOrdering() {
  await swaypageStore.reorderPages({ swaypageId, pages: activePages })
}

const debouncedReorder = debounce(savePageOrdering, 3000, { leading: false, trailing: true })

watch(activePages, () => {
  debouncedPageReorder()
})

const { 
  open: openShareModal,
  close: closeShareModal
} = useModal({
  component: ShareLinkModal,
  attrs: {
    buyersphereId: swaypage.id,
    isBuyerspherePublic: swaypage.isPublic,
    page: {},
    async onClose () {
      closeShareModal()
    }
  }
})

const { 
  open: openSwaypagePageModal,
  close: closeSwaypagePageModal
} = useModal({
  component: AddSwaypagePageModal,
  attrs: {
    buyersphereId: swaypage.id,
    page: {},
    async onClose (props) {
      if (props?.pageId) {
        refreshPages()
        await router.replace({ 
          path: makeNewSwaypageLink(swaypage, props.pageId)
        })
      }
      closeSwaypagePageModal()
    }
  }
})

function createNewPage () {
  openSwaypagePageModal()
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
    @apply bg-gray-background rounded-md py-3 my-0 px-2 -mx-2;

    .text-subtext {
      @apply font-semibold;
    }
  }
}
.show-menu :deep() > * {
  @apply block;
}
</style>
