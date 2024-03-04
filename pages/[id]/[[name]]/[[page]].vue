<template>
  <div @click="debouncedTrackUserAction">
    <TopNav />
    <div class="page-layout">
      <div class="[grid-area:top] page-top bg-purple-background"
        :class="{ 'grayscale-top': !isActive }">
        <div class="flex flex-col gap-4 items-center">
          <div class="flex flex-row items-center gap-2">
            <Logo v-if="buyersphere.buyerLogo" 
              :src="buyersphere.buyerLogo" />
            <h1>{{ buyersphere.buyer }}</h1>
          </div>
          <div v-if="buyersphere.subname || (isSeller && buyersphere.dealAmount > 0)">
            <span v-if="buyersphere.subname" class="tag">
              {{ buyersphere.subname }}
            </span>
            <span v-if="isSeller && buyersphere.dealAmount > 0 && buyersphere.subname"
              class="mx-2 tag">
              | 
            </span>
            <span v-if="isSeller && buyersphere.dealAmount > 0" class="tag">
              {{ format(buyersphere.dealAmount, moneyConfig) }}
            </span>
          </div>
        </div>
      </div>

      <div class="[grid-area:left-header] left-header">
        <div class="flex flex-row items-end gap-2 h-full">
          <BsButton @click="openShareModal">
            <div class="mr-2 body-header"> Share</div> 
            <ShareIcon />
          </BsButton> 
          <template v-if="hasUser">
            <EditButton v-if="isSeller"
              show-text
              @click="editBuyersphere" />
            <ReactivateButton v-else-if="buyersphere.status === 'on-hold'"
              @click="reactivate" />
            <PutOnHoldButton v-else
              @click="putOnHold" />
          </template>
        </div>
      </div>

      <div class="[grid-area:left]">
        <div class="left-sidebar">
          <h3 class="mb-4">Pages</h3>
          <NuxtLink v-for="p in pages"
            class="page-link"
            :class="{underline: `${p.id}` === page}"
            :to="makeBuyersphereLink(buyersphere, p.id)">
            {{ p.title }}
          </NuxtLink>
          <NewButton v-if="isSeller" @click="createNewPage" />

          <div class="h-[80px]" />

          <h3 class="mb-4">Directory</h3>
          <NuxtLink class="page-link"
            :to="makeBuyersphereLink(buyersphere, 'activity-plan')"
            :class="{underline: page === 'activity-plan'}">Activity Plan</NuxtLink>
          <NuxtLink class="page-link"
            :to="makeBuyersphereLink(buyersphere, 'team')"
            :class="{underline: page === 'team'}">Team</NuxtLink>
          <NuxtLink class="page-link"
            :to="makeBuyersphereLink(buyersphere, 'assets')"
            :class="{underline: page === 'assets'}">Assets</NuxtLink>
          <NuxtLink v-if="isSeller"
            class="page-link"
            :to="makeBuyersphereLink(buyersphere, 'insights')"
            :class="{underline: page === 'insights'}">Insights</NuxtLink>
        </div>
      </div>

      <!-- These return the center and center-header sections -->
      <BuyersphereActivityPlan v-if="page === 'activity-plan'"
        @require-login="requireLogin" />
      <BuyersphereTeam v-else-if="page === 'team'" />
      <BuyersphereInsights v-else-if="page === 'insights'" />
      <BuyersphereAssets v-else-if="page === 'assets'" />
      <BuyerspherePage v-else
        :key="route.params.page"
        @require-login="requireLogin" />
      <!-- <BuyersphereNotes v-else-if="page === 'notes'" /> -->

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { useBuyerActivityStore } from '@/stores/buyer-activity';
import { storeToRefs } from 'pinia'
import { useModal } from 'vue-final-modal'
import AddEditBuyersphereModal from '@/components/AddEditBuyersphereModal'
import AddBuyerspherePageModal from '@/components/Buyersphere/AddBuyerspherePageModal'
import AnonymousViewModal from '@/components/Buyersphere/AnonymousViewModal';
import RequireLoginModal from '@/components/Buyersphere/RequireLoginModal';
import ShareLinkModal from '@/components/ShareLinkModal';
import { format } from 'v-money3'
import lodash_pkg from 'lodash';
const { debounce, first } = lodash_pkg;

definePageMeta({
  name: 'swaypage',
  key: route => route.params.id,
})

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyerspherePagesByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, pages, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyerspherePagesByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

const { cookies } = useAppConfig()
const linkedName = useCookie('linked-name', { domain: cookies.domain })
const enteredName = useCookie('entered-name', { domain: cookies.domain })

const { 
  open: openAnonymousViewerModal,
  close: closeAnonymousViewerModal,
} = useModal({
  component: AnonymousViewModal,
  attrs: {
    buyersphereName: buyersphere.buyer,
    linkedName,
    onClose ({ name }) {
      closeAnonymousViewerModal()
      enteredName.value = name
    }
  }
})

if (!hasUser && !enteredName.value) {
  linkedName.value = route.query['sent-to']
  openAnonymousViewerModal()
}

const buyerActivityStore = useBuyerActivityStore()

const isActive = computed(() => buyersphere.status === 'active')

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

// update the url of the page to the latest name of the buyersphere
const router = useRouter()
const { makeBuyersphereLink } = useBuyersphereLinks()

if (pages.length === 0) {
  await buyersphereStore.createPage({ buyersphereId, page: { title: 'New Page'} })
}

const page = computed(() => route.params.page || first(pages).id)

watch(() => buyersphere.buyer, () => {
  router.replace({ 
    path: makeBuyersphereLink(buyersphere, page.value)
  })
})

async function putOnHold() {
  const answer = confirm(`Are you sure you'd like to put this buying process on hold?`)

  if (answer) {
    await buyersphereStore.updateBuyerInput({ buyersphereId, status: "on-hold" })
    buyerActivityStore.captureBuyerActivity({ buyersphereId, activity: "hold-deal" })
  }
}

async function reactivate() {
  const answer = confirm(`Are you sure you want to reactive the buying process?`)
  
  if (answer) {
    await buyersphereStore.updateBuyerInput({ buyersphereId, status: "active" })
    buyerActivityStore.captureBuyerActivity({ buyersphereId, activity: "reactivate-deal" })
  }
}

const { 
  open: openBuyersphereModal,
  close: closeBuyersphereModal,
  patchOptions: patchBuyersphereModalOptions
} = useModal({
  component: AddEditBuyersphereModal,
  attrs: {
    onClose () {
      closeBuyersphereModal()
    }
  }
})

function editBuyersphere() {
  patchBuyersphereModalOptions({ attrs: { buyersphere }})
  openBuyersphereModal()
}

const { 
  open: openBuyerspherePageModal,
  close: closeBuyerspherePageModal
} = useModal({
  component: AddBuyerspherePageModal,
  attrs: {
    buyersphereId,
    page: {},
    async onClose (props) {
      if (props?.pageId) {
        await router.replace({ 
          path: makeBuyersphereLink(buyersphere, props.pageId)
        })
      }
      closeBuyerspherePageModal()
    }
  }
})

function createNewPage () {
  openBuyerspherePageModal()
}

const { 
  open: openLoginModal,
  close: closeLoginModal
} = useModal({
  component: RequireLoginModal,
  attrs: {
    buyersphere,
    page: {},
    async onClose () {
      closeLoginModal()
    }
  }
})

function requireLogin () {
  openLoginModal()
}

const { 
  open: openShareModal,
  close: closeShareModal
} = useModal({
  component: ShareLinkModal,
  attrs: {
    buyersphereId,
    isBuyerspherePublic: buyersphere.isPublic,
    page: {},
    async onClose () {
      closeShareModal()
    }
  }
})

function trackUserAction () {
  buyerActivityStore.captureBuyerActivity({ buyersphereId, activity: "site-activity" })
}

const oneMinute = 60 * 1000;
const debouncedTrackUserAction = debounce(
  trackUserAction, 
  oneMinute, 
  { leading: true, trailing: false, maxWait: oneMinute },
)

if (process.client) {
  onMounted(() => {
    window.addEventListener('scroll', debouncedTrackUserAction)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', debouncedTrackUserAction)
  })
}
</script>

<style lang="postcss" scoped>
.page-top.grayscale-top {
  @apply bg-gray-border;
}

.white-box {
  @apply p-1 px-2 bg-white rounded-md text-gray-subtext;
}

.milestone {
  @apply grid;
  grid-template-areas: 
    "step icon"
    "date icon";
  
  &.selected {
    @apply bg-gray-hover rounded-md mr-[-.25rem] pr-1;
  }

  .milestone-step {
    @apply [grid-area:step] text-right px-2;
  }

  .milestone-date {
    @apply [grid-area:date] text-right tag px-2;
  }

  .milestone-icon {
    @apply [grid-area:icon] self-center px-1 w-[1.375rem];
  }
}
</style>
