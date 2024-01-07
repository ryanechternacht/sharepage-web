<template>
  <div class="[grid-area:left-header] left-header">
    <div class="flex flex-row items-center">
      <CopyToClipboardButton />
    </div>
  </div>

  <div class="[grid-area:right-header] right-header">
    <!-- TODO this is too wide for this part of the page -->
    <div class="flex flex-row-reverse items-center gap-2">
      <div class="flex-grow" />
      <NewButton @click="openSellerModal" text="New Seller" />
      <NewButton @click="openBuyerModal" text="New Buyer" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <h3 class="page-link">Team</h3>
      <div v-scroll-spy-active v-scroll-spy-link 
        class="mt-[-.75rem] mb-[.75rem]">
        <h4 
          @click="navigateTo('#buyer')"
          class="in-page-link">{{ buyersphere.buyer }}</h4>
        <h4 
          @click="navigateTo('#seller')"
          class="in-page-link">{{ organization.name }}</h4>
        <!-- <h4 
          @click="navigateTo('#leadership')"
          class="in-page-link">Leadership</h4>
        <h4 
          @click="navigateTo('#primary-team')"
          class="in-page-link">Primary Team</h4>
        <h4 
          @click="navigateTo('#auxiliary-team')"
          class="in-page-link">Auxiliary Team</h4> -->
      </div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/assets`)">Assets</div>
      <div v-if="isSeller"
        class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/insights`)">Insights</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <!-- <BuyersphereTeamSection
      id="leadership"
      :users="users"
      header="Leadership" />

    <BuyersphereTeamSection
      id="primary-team"
      :users="users"
      header="Primary Team" />

    <BuyersphereTeamSection
      id="auxiliary-team"
      :users="users"
      header="Auxiliary Team" /> -->
    
    <BuyersphereTeamSection
      id="buyer"
      :users="buyersphere.buyerTeam"
      :header="buyersphere.buyer" />

    <BuyersphereTeamSection
      id="seller"
      :users="buyersphere.sellerTeam"
      :header="organization.name" />
    
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy, concat } = lodash_pkg;
import BuyersphereAddBuyerModal from '@/components/Buyersphere/AddBuyerModal'
import BuyersphereAddSellerModal from '@/components/Buyersphere/AddSellerModal'
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const [buyersphere, organization, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
  isUserSeller.value(),
])

// TODO separate user groups
// const users = computed(() => concat(buyersphere.sellerTeam, buyersphere.buyerTeam))

// TODO refactor these into 1 modal
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
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>
