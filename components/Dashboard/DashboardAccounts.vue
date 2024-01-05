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
      <div class="page-link"
        @click="navigateTo(`/dashboard/activities`)">Activities</div>
      <h3 class="page-link">Accounts</h3>
      <div class="page-link"
        @click="navigateTo(`/dashboard/insights`)">Insights</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div class="section">
      <div class="group-header">Accounts</div>
      <div class="item-count">
        {{ buyerspheres.length === 1 ? '1 account' : `${buyerspheres.length} accounts`}}
      </div>
      <div class="mt-[2rem] flex flex-col gap-4">
        <div v-for="bs in buyerspheres"
          class="item-list-row"
          @click="navigateTo(`/buyersphere/${bs.id}`)">
          <Logo :src="bs.buyerLogo" />
          <h3>{{ bs.buyer }}</h3>
          <div class="flex-grow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModal } from 'vue-final-modal'
import AddBuyersphereModal from '@/components/AddBuyersphereModal'

const { apiFetch } = useNuxtApp()
const { data: buyerspheres, refresh } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})

const { open, close } = useModal({
  component: AddBuyersphereModal,
  attrs: {
    onClose () {
      close()
      refresh()
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
