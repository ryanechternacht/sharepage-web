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
      <div class="flex flex-row items-center gap-4">
      <h1>Home</h1>
      <!-- TODO use a real dropdown menu for this -->
        <dropdown-menu
          :overlay="false"
          with-dropdown-closer
          @opened="isDropdownOpen = true"
          @closed="isDropdownOpen = false">
          <template #trigger>
            <div class="flex flex-row items-center gap-2">
              <Component :is="roomType.icon" />
              <div class="subtext flex flex-row items-center cursor-pointer">
                {{ roomType.text }} 
                <ChevronDownIcon class="icon-submenu" />
              </div>
            </div>
          </template>
          <template #body>
            <div class="dropdown-menu">
              <div v-for="roomType in roomTypes" 
                class="dropdown-item"
                dropdown-closer
                @click="setFilter(roomType.key)">
                <Component :is="roomType.icon" class="icon-menu" />  
                {{ roomType.text }}
              </div>
            </div>
          </template>
        </dropdown-menu>
      </div>

      <div class="room-grid">
        <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

        <template v-for="swaypage in swaypages">
          <div class="cell">{{ swaypage.buyer }}</div>
          <div class="cell subtext">{{ swaypage.subname }}</div>
          <div class="cell subtext">
            <template v-if="swaypage.owner">
              <UserAvatar :user="swaypage.owner" />
              {{ swaypage.owner.firstName }} {{ swaypage.owner.lastName }} 
            </template>
          </div>
          <div class="cell">
            <!-- TODO Add this field-->
            <SwaypagePriorityTag :priority="swaypage.priority" />
          </div>
          <div class="cell"><!-- TODO Add this field--> Active</div>
          <div class="cell">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModal } from 'vue-final-modal'
import AddEditSwaypageModal from '@/components/AddEditSwaypageModal'
import lodash_pkg from 'lodash';
const { find } = lodash_pkg;

const { apiFetch } = useNuxtApp()
const { data: swaypages } = await apiFetch('/v0.1/buyerspheres', { 
  // query
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

const roomTypes = [
  {
    text: 'Active',
    icon: markRaw(resolveComponent('FileIcon')),
    key: 'active',
  }, {
    text: 'Templates',
    icon: markRaw(resolveComponent('BookmarkIcon')),
    key: 'templates',
  }, {
    text: 'Archive',
    icon: markRaw(resolveComponent('ArchiveIcon')),
    key: 'archive',
  },
]
const roomType = ref(roomTypes[0])


function setFilter (newType) {
  roomType.value = find(roomTypes, rt => rt.key === newType)
}

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.room-grid {
  @apply grid px-8 gap-x-8 border border-gray-border rounded-md overflow-hidden;
  grid-template-columns: repeat(6, 1fr);

  .cell {
    @apply py-2 relative flex flex-row items-center gap-2;
  
    &::after {
      @apply absolute bg-gray-border h-[1px] w-screen;
      content: '';
      inset-inline-start: -5rem;
      inset-block-start: 0;
    }
  }
}

.dropdown-item {
  @apply flex flex-row items-center gap-2 subtext;
}
</style>
