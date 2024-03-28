<template>
  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center gap-2">
      <NewButton v-if="isSeller"
        text="New Seller" 
        @click="openSellerModal" />
      <NewButton v-if="hasUser"
        text="New Buyer"
        @click="addBuyer" />
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <SwaypageTeamSection
      id="buyer"
      :users="buyersphere.buyerTeam"
      :header="buyersphere.buyer"
      :can-edit="hasUser"
      :can-delete="hasUser"
      @update:user="editBuyer"
      @delete:user="removeUser" />

    <SwaypageTeamSection
      id="seller"
      :users="buyersphere.sellerTeam"
      :header="organization.name"
      :can-delete="isSeller"
      @delete:user="removeUser" />
    
    <div class="bottom-cover" />
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useOrganizationStore } from '@/stores/organization'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import AddEditBuyerModal from '@/components/Swaypage/AddEditBuyerModal'
import BuyersphereAddSellerModal from '@/components/Swaypage/AddSellerModal'
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useSwaypagesStore()
const { getSwaypageByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, organization, hasUser, isSeller] = await Promise.all([
  getSwaypageByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

// TODO separate user groups
// const users = computed(() => concat(buyersphere.sellerTeam, buyersphere.buyerTeam))

// TODO refactor these into 1 modal
const { 
  open: openBuyerModal, 
  close: closeBuyerModal, 
  patchOptions: patchBuyerModalOptions 
} = useModal({
  component: AddEditBuyerModal,
  attrs: {
    team: buyersphere.buyer,
    buyersphereId,
    onClose () {
      closeBuyerModal()
    }
  }
})

const { 
  open: openSellerModal,
  close: closeSellerModal,
 } = useModal({
  component: BuyersphereAddSellerModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeSellerModal()
    }
  }
})

function editBuyer({ user }) {
  patchBuyerModalOptions({ attrs: { user, team: buyersphere.buyer }})
  openBuyerModal()
}

function addBuyer() {
  patchBuyerModalOptions({ attrs: { user: {}, team: buyersphere.buyer }})
  openBuyerModal()
}

async function removeUser({ user }) {
  const c = confirm(`Are you sure you want to remove ${user.firstName} ${user.lastName}?`)

  if (c) {
    await buyersphereStore.removeBuyerUser({ buyersphereId, userId: user.id })
  }
}
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
