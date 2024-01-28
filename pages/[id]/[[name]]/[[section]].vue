<template>
  <div>
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
          <div v-if="buyersphere.subname || buyersphere.dealAmount > 0">
            <span v-if="buyersphere.subname" class="tag">
              {{ buyersphere.subname }}
            </span>
            <span v-if="buyersphere.dealAmount > 0 && buyersphere.subname"
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
        <div class="flex flex-row items-center gap-2">
          <CopyToClipboardButton />
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

      <!-- These return the left, center, and center-header sections -->
      <BuyersphereDiscoveryGuide v-if="mainSection === 'discovery-guide'" />
      <BuyersphereActivityPlan v-else-if="mainSection === 'activity-plan'" />
      <BuyersphereTeam v-else-if="mainSection === 'team'" />
      <BuyersphereInsights v-else-if="mainSection === 'insights'" />
      <BuyersphereAssets v-else-if="mainSection === 'assets'" />
      <BuyersphereActivityPlanOld v-else-if="mainSection === 'activity-plan-old'" />
      <!-- <BuyersphereNotes v-else-if="mainSection === 'notes'" /> -->

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { useBuyerActivityStore } from '~/stores/buyer-activity';
import { storeToRefs } from 'pinia'
import { useModal } from 'vue-final-modal'
import AddEditBuyersphereModal from '@/components/AddEditBuyersphereModal'
import { format } from 'v-money3'

definePageMeta({
  name: 'buyersphere'
})

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

const buyerActivityStore = useBuyerActivityStore()

const isActive = computed(() => buyersphere.status === 'active')

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const mainSection = computed(
  () => route.params.section ? route.params.section : 'discovery-guide')

// update the url of the page to the latest name of the buyersphere
const router = useRouter()
const { makeBuyersphereLink } = useBuyersphereLinks()
router.replace({ path: makeBuyersphereLink(buyersphere, mainSection.value) })

watch(() => buyersphere.buyer, () => {
  router.replace({ path: makeBuyersphereLink(buyersphere, mainSection.value) })
})

async function putOnHold() {
  const answer = confirm(`Are you sure you'd like to put this buying process on hold?`)

  if (answer) {
    await buyersphereStore.updateBuyerInput({ buyersphereId, status: "on-hold" })
    buyerActivityStore.captureBuyerActivity({ activity: "hold-deal" })
  }
}

async function reactivate() {
  const answer = confirm(`Are you sure you want to reactive the buying process?`)
  
  if (answer) {
    await buyersphereStore.updateBuyerInput({ buyersphereId, status: "active" })
    buyerActivityStore.captureBuyerActivity({ activity: "reactivate-deal" })
  }
}

const { open, close, patchOptions } = useModal({
  component: AddEditBuyersphereModal,
  attrs: {
    onClose () {
      close()
    }
  }
})

function editBuyersphere() {
  patchOptions({ attrs: { buyersphere }})
  open()
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
