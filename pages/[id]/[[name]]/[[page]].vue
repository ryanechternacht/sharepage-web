<template>
  <div class="grid custom-subgrid col-span-2">
    <!-- TODO reimplment right sidebar -->
    <div class="col-span-2">
      <div class="h-[2.375rem] flex flex-row items-center gap-6">
        <div class="flex flex-row">
          <UserAvatar v-for="s in swaypage.sellerTeam" 
            class="-mr-.5"
            size="small"
            :user="s" />
          <!-- TODO this text should be better -->
          <div class="ml-4">Made by
            <span v-for="(s, i) in swaypage.sellerTeam">{{ i > 1 ? "s.firstName, " : s.firstName }}</span>
          </div>
        </div>
        <div class="flex-grow" />
          <!-- TODO implement -->
        <!-- <div>active</div> -->
        <div v-if="canEdit" class="flex flex-row items-center gap-2">
          <template v-if="swaypage.isPublic">
            <EyeIcon class="text-green-good icon-submenu" />
            <div class="subtext">Public</div>
          </template>
          <template v-else>
            <EyeOffIcon class="text-orange-neutral icon-submenu" />
            <div class="subtext">Private</div>
          </template>
        </div>
        <div v-if="canEdit" class="flex flex-row items-center gap-2">
          <!-- Putting the :class directly on the icon prevented it from updating dynamically -->
          <div :class="{'text-blue-great': saveSubmissionState === 'ready' || saveSubmissionState === 'submitted',
                        'text-orange-neutral': saveSubmissionState === 'submitting'}">
            <FileIcon class="icon-submenu" />
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
            <MoreVerticalIcon class="-ml-4" />
          </template>
          <template #body>
            <div class="dropdown-menu">
              <div class="dropdown-item"
                dropdown-closer
                @click="openSettingsModal()">Edit Settings</div>
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

    <!-- <div class="ml-2">
      <div class="sticky top-[5.75rem]">
        <div class="mt-[5.75rem] flex flex-col gap-4 items-end">
          <div class="text-gray-medium">Key Links</div>
          <a v-for="link in links"
            class="rightbar-link"
            :href="link.link">
            <ExternalLinkIcon class="icon-menu" />
            <div class="text-right">{{ link.text }}</div>
          </a>
          <div class="rightbar-link cursor-pointer">
            <MessageCircleIcon class="icon-menu" />
            <div class="text-right">Please Opt Me Out</div>
          </div>
          <div class="rightbar-link cursor-pointer"
            @click="addNewLink">
            <PlusSquareIcon class="icon-menu text-gray-medium" />
            <div class="text-gray-medium text-right">New Link</div>
          </div>
        </div>
      </div>
    </div> -->
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
import EditPageSettingsModal from '@/components/Swaypage/EditPageSettingsModal'
import { useModal } from 'vue-final-modal'

useEmbedly()

// /demo/65/123445566/60
const route = useRoute()
const swaypageId = parseInt(route.params.id)

const swaypageStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(swaypageStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller, getMeCached } = storeToRefs(usersStore)

const [swaypage, pages, hasUser, isSeller, user] = await Promise.all([
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

definePageMeta({
  name: 'swaypage',
  layout: 'swaypage',
})

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

const keys = map(page.body.sections, s => s.key || 0)
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

const body = ref({ sections: map(page.body.sections, updateSection) })
const title = ref(page.title)

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

const links = ref([
  {
    text: 'Schedule a Call',
    link: 'https://www.google.com',
  },
  {
    text: 'Connect on LinkedIn',
    link: 'https://www.yahoo.com',
  },
  {
    text: 'See our Testemonials',
    link: 'https://www.microsoft.com',
  },
])

function addNewLink () {
  links.value.push({
    text: 'New Link',
    link: 'https://www.facebook.com',
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
.custom-subgrid {
  grid-template-columns: subgrid;
}

.rightbar-link {
  @apply flex flex-row-reverse items-center gap-3;

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
</style>
