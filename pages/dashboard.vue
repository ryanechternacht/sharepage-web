<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton>
      </template>
    </TopNav>

    <div class="p-10">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import AddSwaypageModal from '@/components/Modals/AddSwaypageModal'

definePageMeta({
  middleware: ['enforce-seller'],
})

const modal = useModal()

function openModal () {
  modal.open(AddSwaypageModal, {
    async onClose (props) {
      if (props?.swaypageId) {
        const router = useRouter()
        await router.replace({
          // TODO change when we get rid of the old pages
          path: `/${props.swaypageId}`
        })
      }
      modal.close()
    }
  })
}
</script>

<style lang="postcss" scoped>
</style>
