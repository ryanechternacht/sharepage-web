<template>
  <div>
    <TopNavNew>
      <template #action-button>
        <SpButton
          @click="openCreateSwaypageModal">
          <template #icon>
            <FileIcon class="icon-menu" />
          </template>
          New
        </SpButton>
      </template>
    </TopNavNew>

    <div class="p-10">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import AddEditSwaypageModal from '@/components/AddEditSwaypageModal'
import { useModal } from 'vue-final-modal'

definePageMeta({
  middleware: ['enforce-seller'],
})

const {
  open: openSwaypageModal, 
  close: closeSwaypageModal, 
  patchOptions: patchSwaypageModalOptions,
} = useModal({
  component: AddEditSwaypageModal,
  attrs: {
    buyersphere: {},
    async onClose (props) {
      if (props?.buyersphereId) {
        const router = useRouter()
        await router.replace({
          // TODO change when we get rid of the old pages
          path: `/${props.buyersphereId}`
        })
      }
      closeSwaypageModal()
    }
  }
})

function openCreateSwaypageModal ({ forDiscoveryRoom } = {}) {
  patchSwaypageModalOptions({ attrs: { forDiscoveryRoom } })
  openSwaypageModal()
}
</script>

<style lang="postcss" scoped>
</style>
