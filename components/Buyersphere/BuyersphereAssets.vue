<template>
  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton v-if="hasUser" @click="addAsset" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'discovery-guide')">Discovery Guide</NuxtLink>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'activity-plan')">Activity Plan</NuxtLink>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'team')">Team</NuxtLink>      
      <h3 class="page-link">Assets</h3>
      <NuxtLink v-if="isSeller"
        class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'insights')">Insights</NuxtLink>
    </div>
  </div>
  <div class="[grid-area:center] page-center">
    <BuyersphereAssetSection
      header="Assets"
      :assets="buyersphere.resources"
      @update:asset="editAsset"
      @delete:asset="deleteAsset" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import AddEditAssetModal from '@/components/Buyersphere/AddEditAssetModal.vue';
import { useModal } from 'vue-final-modal'

const { makeBuyersphereLink } = useBuyersphereLinks()

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
  isUserSeller.value()
])

const { open, close, patchOptions } = useModal({
  component: AddEditAssetModal,
  attrs: {
    buyersphereId,
    onClose () {
      close ()
    }
  }
})

function editAsset({ asset }) {
  patchOptions({ attrs: { asset }})
  open()
}

function addAsset() {
  patchOptions({ attrs: { asset: {} }})
  open()
}

async function deleteAsset({ asset }) {
  const c = confirm(`Are you sure you want to delete ${asset.title}`)

  if (c) {
    await buyersphereStore.deleteResource({ buyersphereId, resourceId: asset.id })
  }
}
</script>

<style lang="postcss" scoped>
</style>
