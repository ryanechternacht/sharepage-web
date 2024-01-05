<template>
  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton @click="addAssetTemplate" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/settings/personal`)">Personal</div>
      <div class="page-link"
        @click="navigateTo(`/settings/guide-template`)">Guide Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/timeline-template`)">Timeline Template</div>
      <h3 class="page-link">Assets Template</h3>
      <div class="page-link"
        @click="navigateTo(`/settings/admin`)">Admin</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center">
    <BuyersphereAssetSection
      is-template
      header="Assets"
      :assets="resources"
      @update:asset="editAssetTemplate"
      @delete:asset="deleteAssetTemplate" />
  </div>
</template>

<script setup>
import { useResourcesStore } from '@/stores/resources'
import { storeToRefs } from 'pinia'
import AddEditAssetTemplateModal from '@/components/Settings/AddEditAssetTemplateModal'
import { useModal } from 'vue-final-modal'

const resourcesStore = useResourcesStore()
const { getResourcesCached } = storeToRefs(resourcesStore)

const [resources] = await Promise.all([
  getResourcesCached.value(),
])

const { open, close, patchOptions } = useModal({
  component: AddEditAssetTemplateModal,
  attrs: {
    onClose () {
      close ()
    }
  }
})

function editAssetTemplate({ asset }) {
  patchOptions({ attrs: { asset }})
  open()
}

function addAssetTemplate() {
  patchOptions({ attrs: { asset: {} }})
  open()
}

function deleteAssetTemplate({ asset }) {
  const c = confirm(`Are you sure you want to delete ${asset.title}`)

  if (c) {
    resourcesStore.deleteResource({ resourceId: asset.id })
  }
}
</script>

