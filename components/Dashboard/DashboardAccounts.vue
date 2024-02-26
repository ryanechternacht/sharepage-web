<template>
  <div class="[grid-area:left-header] left-header">
    <!-- left-header -->
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton @click="open" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <NuxtLink class="page-link"
        :to="`/dashboard/activities`">Activities</NuxtLink>
      <h3 class="page-link">Accounts</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <a v-if="activeDeals.length" 
          class="in-page-link" 
          href="#active">Active</a>
        <a v-if="onHoldDeals.length" 
          class="in-page-link" 
          href="#on-hold">On Hold</a>
        <a v-if="archivedDeals.length" 
          class="in-page-link" 
          href="#archived">Archived</a>
      </div>
      <NuxtLink class="page-link"
        :to="`/dashboard/insights`">Insights</NuxtLink>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <DashboardAccountsSection v-if="activeDeals.length"
      id="active"
      :accounts="activeDeals"
      header="Active Deals"
      @update:deal-status="updateDealStatus" />

    <DashboardAccountsSection v-if="onHoldDeals.length"
      id="on-hold"
      :accounts="onHoldDeals"
      header="On Hold Deals"
      @update:deal-status="updateDealStatus" />

    <DashboardAccountsSection v-if="archivedDeals.length"
      id="archived"
      :accounts="archivedDeals"
      header="Archived Deals"
      @update:deal-status="updateDealStatus" />
  </div>
</template>

<script setup>
import { useModal } from 'vue-final-modal'
import AddEditBuyersphereModal from '@/components/AddEditBuyersphereModal'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const buyersphereStore = useBuyerspheresStore()

const { apiFetch } = useNuxtApp()
const { data: buyerspheres, refresh } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})

const { open, close } = useModal({
  component: AddEditBuyersphereModal,
  attrs: {
    buyersphere: {},
    onClose () {
      close()
      refresh()
    }
  }
})

const activeDeals = computed(() =>
  orderBy(
    filter(buyerspheres.value, b => b.status === 'active'),
    ['buyer'],
    ['asc']
  )
)

const onHoldDeals = computed(() =>
  orderBy(
    filter(buyerspheres.value, b => b.status === 'on-hold'),
    ['buyer'],
    ['asc']
  )
)

const archivedDeals = computed(() =>
  orderBy(
    filter(buyerspheres.value, b => b.status === 'opt-out'),
    ['buyer'],
    ['asc']
  )
)

async function updateDealStatus({ account, status }) {
  await buyersphereStore.updateBuyerInput({ buyersphereId: account.id, status })
  account.status = status
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
