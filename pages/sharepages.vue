<template>
  <div>
    <TopNav active-link="sharepages">
      <template #action-button>
        <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton>

        <UButton @click="openQuickCreateModal">
          🪄 Quick Create
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div>
        <div class="flex flex-row items-center gap-4">
          <h1>Home</h1>
          <UDropdown :items="sharepageMenu"
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
import AddSharepageModal from '@/components/Modals/AddSharepageModal'
import QuickCreateModal from '@/components/Modals/QuickCreateModal'

const sharepageMenu = [
  [{
    label: 'Sharepages',
    icon: 'i-heroicons-document',
    to: '/sharepages'
  }, {
    label: 'Templates',
    icon: 'i-heroicons-bookmark',
    to: '/sharepages/templates'
  }, {
    label: 'Archive',
    icon: 'i-heroicons-archive-box',
    to: '/sharepages/archived'
  }],
]

const route = useRoute()
const selectedType = computed(() => {
  if (route.fullPath === '/sharepages') {
    return sharepageMenu[0][0]
  } else if (route.fullPath === '/sharepages/templates') {
    return sharepageMenu[0][1]
  } else if (route.fullPath === '/sharepages/archived') {
    return sharepageMenu[0][2]
  }
})

const modal = useModal()
function openModal () {
  modal.open(AddSharepageModal, {
    async onClose (props) {
      modal.close()
      if (props?.sharepageId) {
        await navigateTo(`/${props.sharepageId}`)
      }
    }
  })
}

function openQuickCreateModal () {
  modal.open(QuickCreateModal, {
    async onClose (props) {
      modal.close()
      if (props?.sharepageId) {
        await navigateTo(`/${props.sharepageId}`)
      }
    }
  })
}
</script>
