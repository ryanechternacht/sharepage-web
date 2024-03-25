<template>
  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton v-if="hasUser" @click="addAsset" />
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
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import AddEditAssetModal from '@/components/Buyersphere/AddEditAssetModal.vue';
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn } = storeToRefs(usersStore)

const [buyersphere, hasUser] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  isUserLoggedIn.value(),
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
