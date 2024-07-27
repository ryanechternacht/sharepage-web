<template>
  <div>
    <TopNav active-link="swaypages">
      <template #action-button>
        <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div>
        <div class="flex flex-row items-center gap-4">
          <h1>Home</h1>
          <UDropdown :items="swaypageMenu"
            :popper="{ placement: 'bottom-start' }">
            <div class="flex flex-row items-center gap-2">
              <!-- <Component :is="filterOption.icon" class="subtext" /> -->
              <UIcon :name="selectedType.icon" class="subtext" />
              <div class="subtext flex flex-row items-center cursor-pointer">
                {{ selectedType.label }}
                <UIcon class="icon-submenu" name="i-heroicons-chevron-down" />
              </div>
            </div>
          </UDropdown>
        </div>
      
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import AddSwaypageModal from '@/components/Modals/AddSwaypageModal'

const swaypageMenu = [
  [{
    label: 'Swaypages',
    icon: 'i-heroicons-document',
    to: '/swaypages'
  }, {
    label: 'Templates',
    icon: 'i-heroicons-bookmark',
    to: '/swaypages/templates'
  }, {
    label: 'Archive',
    icon: 'i-heroicons-archive-box',
    to: '/swaypages/archived'
  }],
]

const route = useRoute()
const selectedType = computed(() => {
  if (route.fullPath === '/swaypages') {
    return swaypageMenu[0][0]
  } else if (route.fullPath === '/swaypages/templates') {
    return swaypageMenu[0][1]
  } else if (route.fullPath === '/swaypages/archived') {
    return swaypageMenu[0][2]
  }
})

const modal = useModal()
function openModal () {
  modal.open(AddSwaypageModal, {
    async onClose (props) {
      modal.close()
      if (props?.swaypageId) {
        await navigateTo(`/${props.swaypageId}`)
      }
    }
  })
}
</script>
