<template>
  <div class="[grid-area:left-header]">
    <!-- TODO share button -->
  </div>

  <div class="[grid-area:center-header]">
    <div class="flex flex-row items-center gap-2">
      <div class="flex-grow" />
      <BsButton @click="openBuyerModal">
        <img src="/svg/new-thing.svg" class="mr-2"> New Buyer
      </BsButton>
      <BsButton @click="openSellerModal">
        <img src="/svg/new-thing.svg" class="mr-2"> New Seller
      </BsButton>
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="sticky top-[2rem] py-2 px-12">
      <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
      <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <h3 class="page-link">Team</h3>
      <div v-scroll-spy-active v-scroll-spy-link 
        class="mt-[-.75rem] mb-[.75rem]">
        <h4 
          @click="navigateTo('#leadership')"
          class="in-page-link">Leadership</h4>
        <h4 
          @click="navigateTo('#primary-team')"
          class="in-page-link">Primary Team</h4>
        <h4 
          @click="navigateTo('#auxiliary-team')"
          class="in-page-link">Auxiliary Team</h4>
      </div>
    </div>
  </div>

  <div class="page-center" v-scroll-spy>
    <InternalBuyersphereTeamSection
      id="leadership"
      :users="users"
      header="Leadership" />

    <InternalBuyersphereTeamSection
      id="primary-team"
      :users="users"
      header="Primary Team" />

    <InternalBuyersphereTeamSection
      id="auxiliary-team"
      :users="users"
      header="Auxiliary Team" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
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

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value()
])

// TODO separate user groups
const users = computed(() => concat(buyersphere.sellerTeam, buyersphere.buyerTeam))

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
.page-link {
  @apply mb-4 cursor-pointer;
}

.in-page-link {
  @apply py-2 pl-6 cursor-pointer rounded-md flex flex-row items-center;

  &.active {
    @apply bg-gray-hover pl-[.375rem];

    &::before {
      @apply h-[.875rem] mr-1;
      content: url('/svg/compass.svg');
    }
  }
}

.page-center {
  @apply flex flex-col gap-16;
  grid-area: center;
}

.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>
