<template>
  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton @click="addAsset" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/team`)">Team</div>      
      <h3 class="page-link">Assets</h3>
      <div v-if="isSeller"
        class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/insights`)">Insights</div>
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

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const [buyersphere, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
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
