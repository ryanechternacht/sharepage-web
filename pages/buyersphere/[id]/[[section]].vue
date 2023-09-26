<template>
  <div>
    <!-- TODO add this back in? -->
    <!-- <NuxtLoadingIndicator /> -->
    <div class="min-h-screen">
      <TopNav />
      <div class="bg-teal-background grid-row pb-3">
        <!-- row 1 col 1 -->
        <section class="side-bar h-100% flex flex-col justify-items-center gap-2">
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
        <section class="side-bar flex flex-col">
          <div class="flex-grow flex flex-row justify-between items-center">
            <h3>Qualification by:</h3>
            <h3 class="text-purple">June 28th</h3>
          </div>
          <div class="flex-grow flex flex-row justify-between items-center">
            <div class="gray">+ ACTION</div>
            <div class="gray">+ NOTE</div>
            <div class="gray">+ RESOURCE</div>
          </div>
        </section>
      </div>

        <!-- row 2 col 1 -->
      <div class="grid-row">
        <section class="side-bar">
          <h3 class="section-header">👋 People</h3>
          <div class="gray-outline p-3">
            <div class="mb-2 flex flex-row items-center gap-x-4">
              <div class="w-full flex flex-row justify-between">
                <p>{{ buyersphere.buyer }} Team</p>
                <BsButton @click="openBuyerModal">+ Add</BsButton>
              </div>
            </div>
            <PersonList :people="buyersphere.buyerTeam" />
          </div>

          <div class="gray-outline mt-4 p-3">
            <div class="w-full flex flex-row justify-between">
              <p>{{ organization.name }} Team</p>
              <BsButton @click="openSellerModal">+ Add</BsButton>
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
              v-if="mainSection === 'overview'"
              :intro-message="buyersphere.introMessage"
              @update:overview="saveOverview" />
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
import { storeToRefs } from 'pinia'
import { useModal } from 'vue-final-modal'
import AddBuyerModal from '@/components/AddBuyerModal'
import AddSellerModal from '@/components/AddSellerModal'

const route = useRoute()
const buyersphereId = route.params.id

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached,  } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value()
])

const mainSections = ['overview', 'features', 'pricing', 'notes', 'resources']
const mainSection = computed(
  () => route.params.section ? route.params.section : 'overview')

async function changeSection (section) {
  await navigateTo({ path: section === 'overview' 
    ? `/buyersphere/${route.params.id}` 
    : `/buyersphere/${route.params.id}/${section}` })
}

const { open: openBuyerModal, close: closeBuyerModal } = useModal({
  component: AddBuyerModal,
  attrs: {
    buyer: buyersphere.buyer,
    buyersphereId,
    onClose () {
      closeBuyerModal()
    }
  }
})

const { open: openSellerModal, close: closeSellerModal } = useModal({
  component: AddSellerModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeSellerModal()
    }
  }
})

// store.$subscribe(() => {
//   buyersphere.value = getBuyersphereByIdCached.value(buyersphereId)
// })

function saveOverview (overview) {
  throw "not implemented!"
  // const clone = cloneDeep(buyersphere.value)
  // clone.pages.overview = overview
  // store.save(clone)
}

function updateStage ({ stage }) {
  buyersphereStore.saveStage({ buyersphereId, stage })
}

function updateStatus ({ status }) {
  buyersphereStore.saveStatus({ buyersphereId, status })
}

function updatePricingCanPay ({ canPay }) {
  buyersphereStore.savePricingCanPay({ buyersphereId, pricingCanPay: canPay })
}

function updatePricingTierId ({ tierId }) {
  buyersphereStore.savePricingTierId({ buyersphereId, pricingTierId: tierId })
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

.gray-outline {
  @apply rounded-md border border-gray-lighter;
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
  @apply border-b border-gray-dark pb-0.5;
}

/* .router-link-active {
  @apply bg-green-jewel rounded-full text-white px-2 py-[1px];
} */

.white-background {
  @apply bg-white;
}
</style>
