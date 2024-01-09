<template>
  <div>
    <!-- TODO add this back in? -->
    <!-- <NuxtLoadingIndicator /> -->
    <div class="min-h-screen">
      <div class="bg-green-background">
        <TopNav />
        <div class="grid-row pb-3">
          <!-- row 1 col 1 -->
          <section class="side-bar h-100% logo-grid"
            :class="{ grayscale: !isActive }">
            <div class="logo-section">
              <Logo
                :src="buyersphere.buyerLogo"
                size="large"
                style="grid-area: logo" />
              <h3 style="grid-area: company">{{ buyersphere.buyer }}</h3>
              <Tag
                color="gray"
                width="3.75rem"
                height="0.75rem"
                style="grid-area: label">Buyer</Tag>
            </div>
            <div>
              <img
                v-if="user.buyersphereRole === 'admin'"
                class="cursor-pointer w-4"
                src="/svg/settings.svg"
                @click="openEditModal">
            </div>
            <div class="logo-section">
              <Logo
                :src="organization.logo"
                size="large"
                style="grid-area: logo" />
              <h3 style="grid-area: company">{{ organization.name }}</h3>
              <Tag
                color="gray"
                width="3.75rem"
                height="0.75rem"
                style="grid-area: label">Seller</Tag>
            </div>
          </section>

          <!-- row 1 col 2 -->
          <section class="flex-grow">
            <BuyersphereDealStage 
              :buyersphere="buyersphere"
              @update:stage="updateStage"
              @update:status="updateStatus" />
          </section>

          <!-- row 1 col 3 -->
          <section class="side-bar flex flex-col"
            :class="{ grayscale: !isActive }">
            <div class="flex-grow flex flex-row justify-between items-center">
              <h3>{{ actionDate.stage }}</h3>
              <h3 :class="[actionDate.isOverdue ? 'text-red-jewel' : 'text-green-primary']">
                {{ actionDate.date }}
              </h3>
            </div>
            <div class="flex-grow flex flex-row justify-around items-center">
              <BsButton @click="navigateTo(`/buyersphere/${buyersphereId}/notes`)">+ Note</BsButton>
              <BsButton @click="navigateTo(`/buyersphere/${buyersphereId}/resources`)">+ Resource</BsButton>
            </div>
          </section>
        </div>
      </div>

        <!-- row 2 col 1 -->
      <div class="grid-row"
        :class="{ grayscale: !isActive }">
        <section class="side-bar">
          <h3 class="section-header">👋 People</h3>
          <div class="gray-outline p-3">
            <div class="mb-2 flex flex-row items-center gap-x-4">
              <div class="w-full flex flex-row justify-between items-center">
                <p>{{ buyersphere.buyer }} Team</p>
                <BsButton @click="openBuyerModal">+ Add</BsButton>
              </div>
            </div>
            <PersonList :people="buyersphere.buyerTeam" />
          </div>

          <div class="gray-outline mt-4 p-3">
            <div class="w-full flex flex-row justify-between items-center">
              <p>{{ organization.name }} Team</p>
              <BsButton v-if="user.buyersphereRole === 'admin'" 
                @click="openSellerModal">+ Add</BsButton>
            </div>
            <PersonList :people="buyersphere.sellerTeam" />
          </div>
        </section>

        <!-- row 2 col 2 -->
        <!-- TODO this should probably be routing based -->
        <section class="flex-grow">
          <h3 class="section-header">🚀 Information</h3>
          <div class="gray-outline px-12 pt-6 pb-8">
            <PillNav
              class="mb-4"
              :options="mainSections"
              :selected="mainSection"
              @update:selected="changeSection" />
            <BuyersphereOverview
              v-if="mainSection === 'overview'" />
            <BuyersphereFeatures
              v-else-if="mainSection === 'features'" />
            <BuyerspherePricing
              v-else-if="mainSection === 'pricing'"
              :buyersphere="buyersphere"
              @update:can-pay="updatePricingCanPay"
              @update:tier-id="updatePricingTierId" />
            <BuyersphereNotes
              v-else-if="mainSection === 'notes'"
              :notes="buyersphere.notes" />
            <BuyersphereResources
              v-else-if="mainSection === 'resources'"
              :resources="buyersphere.resources"
              @create:resource="createResource"
              @update:resource="updateResource"
              @delete:resource="deleteResource" />
          </div>
        </section>

        <!-- row 2 col 3 -->
        <!-- TODO should this be routing based? -->
        <section class="side-bar">
          <h3 class="section-header">💡 Collaborate</h3>
          <BuyersphereCollaboration 
            class="gray-outline p-3"/>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { useModal } from 'vue-final-modal'
import BuyersphereAddBuyerModal from '@/components/Buyersphere/AddBuyerModal'
import BuyersphereAddSellerModal from '@/components/Buyersphere/AddSellerModal'
import BuyersphereEditBuyersphereModal from '@/components/Buyersphere/EditBuyersphereModal'

const route = useRoute()
const buyersphereId = route.params.id

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [buyersphere, organization, user] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
  getMeCached.value(),
])

if (buyersphere === null) {
  // if we're here, the user has an account, but can't see this specific
  // buyersphere
  showError({ 
    statusCode: 404, 
    statusMessage: `We're sorry, but you don't have access to this Buyersphere.
      Please reach out to your contact if you think this is a mistake.`
  })
}

const mainSections = computed(() => 
  buyersphere.showPricing
    ? ['overview', 'features', 'pricing', 'notes', 'resources']
    : ['overview', 'features', 'notes', 'resources']
)
const mainSection = computed(
  () => route.params.section ? route.params.section : 'overview')

async function changeSection (section) {
  await navigateTo({ path: section === 'overview' 
    ? `/buyersphere/${route.params.id}` 
    : `/buyersphere/${route.params.id}/${section}` })
}

const { open: openBuyerModal, close: closeBuyerModal } = useModal({
  component: BuyersphereAddBuyerModal,
  attrs: {
    buyer: buyersphere.buyer,
    buyersphereId,
    onClose () {
      closeBuyerModal()
    }
  }
})

const { open: openSellerModal, close: closeSellerModal } = useModal({
  component: BuyersphereAddSellerModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeSellerModal()
    }
  }
})

const { open: openEditModal, close: closeEditModal } = useModal({
  component: BuyersphereEditBuyersphereModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeEditModal()
    }
  }
})

const isActive = computed(() => buyersphere.status === 'active')

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM Do')
}

const actionDate = computed(() => {
  if (buyersphere.currentStage === 'qualification') {
    return {
      stage: 'Qualification by:', 
      date: formatDate(buyersphere.qualificationDate),
      isOverdue: dayjs(new Date()).isAfter(buyersphere.qualificationDate)
    }
  } else if (buyersphere.currentStage === 'evaluation') {
    return {
      stage: 'Evaluated by:', 
      date: formatDate(buyersphere.evaluationDate),
      isOverdue: dayjs(new Date()).isAfter(buyersphere.evaluationDate)
    }
  } else if (buyersphere.currentStage === 'decision') {
    return {
      stage: 'Decided by:', 
      date: formatDate(buyersphere.decisionDate),
      isOverdue: dayjs(new Date()).isAfter(buyersphere.decisionDate)
    }
  } else if (buyersphere.currentStage === 'adoption') {
    return {
      stage: 'Adopted by:', 
      date: formatDate(buyersphere.adoptionDate),
      isOverdue: dayjs(new Date()).isAfter(buyersphere.adoptionDate)
    }
  }
})

function updateStage ({ stage }) {
  buyersphereStore.advanceStage({ buyersphereId, stage })
}

function updateStatus ({ status }) {
  buyersphereStore.updateBuyerInput({ buyersphereId, status })
}

function updatePricingCanPay ({ canPay }) {
  buyersphereStore.savePricingCanPay({ buyersphereId, pricingCanPay: canPay })
}

function createResource({ title, link }) {
  buyersphereStore.createResource({ buyersphereId, title, link })
}

function updateResource({ resourceId, title, link }) {
  buyersphereStore.updateResource({ buyersphereId, resourceId, title, link })
}

function deleteResource({ resourceId }) {
  buyersphereStore.deleteResource({ buyersphereId, resourceId })
}
</script>

<style lang="postcss" scoped>
.grid-row {
  @apply flex flex-row gap-x-4 px-8;
}

.side-bar {
  @apply min-w-[274px] max-w-[274px];
}

section {
  @apply bg-white rounded-md py-2 px-3;
}

.logo-grid {
  @apply grid grid-rows-2 gap-y-2 gap-x-1;
  grid-template-columns: 1fr auto;
}

.gray-outline {
  @apply rounded-md border border-gray-hover;
}

.section-header {
  @apply leading-[48px];
}

.logo-section {
  @apply grid gap-x-2;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  grid-template-areas: "logo company" "logo label";
}

.deal-logo {
  @apply w-[2.25rem] h-[2.25rem] flex flex-col items-center;
  grid-area: logo;

  * {
    @apply max-h-[2.25rem] max-w-[2.25rem];
  }
}

.tag.selected {
  @apply border-b border-gray-body pb-0.5;
}

.white-background {
  @apply bg-white;
}
</style>
