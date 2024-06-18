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

        <div v-if="selectedType.label === 'Swaypages'" 
          class="room-grid active-rooms">
          <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

          <NuxtLink class="contents cursor-pointer group" v-for="swaypage in activeRooms"
            :to="makeInternalSwaypageLink(swaypage)">
            <div class="cell body">
              <Logo :src="swaypage.buyerLogo" class="icon-menu" />
              {{ swaypage.buyer }}
            </div>
            <div class="cell subtext">{{ swaypage.subname }}</div>
            <div class="cell subtext">
              <template v-if="swaypage.owner">
                <UserAvatar :user="swaypage.owner" />
                {{ swaypage.owner?.firstName }} {{ swaypage.owner?.lastName }} 
              </template>
            </div>
            <div class="cell">
              <SwaypagePriorityTag :priority="swaypage.priority" />
            </div>
            <div class="cell">
              <SwaypageStatusTag
                :last-activity-date="swaypage.mostRecentBuyerActivity"
                :isOnHold="swaypage.status === 'on-hold'" />
            </div>
            <div class="cell subtext">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
          </NuxtLink>
        </div>

        <div v-else-if="selectedType.label === 'Templates'" 
          class="room-grid template-rooms">
          <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

          <NuxtLink class="contents cursor-pointer group" v-for="swaypage in templateRooms"
            :to="makeInternalSwaypageLink(swaypage)">
            <div class="cell body">{{ swaypage.buyer }}</div>
            <div class="cell subtext">
              <template v-if="swaypage.owner">
                <UserAvatar :user="swaypage.owner" />
                {{ swaypage.owner?.firstName }} {{ swaypage.owner?.lastName }} 
              </template>
            </div>
            <div class="cell subtext">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
          </NuxtLink>
        </div>

        <div v-if="selectedType.label === 'Archive'" 
          class="room-grid archive-rooms">
          <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Room Type</h2>
          <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

          <NuxtLink class="contents cursor-pointer group" v-for="swaypage in archiveRooms"
            :to="makeInternalSwaypageLink(swaypage)">
            <div class="cell body">
              <Logo :src="swaypage.buyerLogo" class="icon-menu" />
              {{ swaypage.buyer }}
            </div>
            <div class="cell subtext">{{ swaypage.subname }}</div>
            <div class="cell subtext">
              <template v-if="swaypage.owner">
                <UserAvatar :user="swaypage.owner" />
                {{ swaypage.owner?.firstName }} {{ swaypage.owner?.lastName }} 
              </template>
            </div>
            <div class="cell subtext">{{ roomTypeMap[swaypage.roomType] }}</div>
            <div class="cell subtext">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import AddSwaypageModal from '@/components/Modals/AddSwaypageModal'

const { apiFetch } = useNuxtApp()
const { data: swaypages } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})

const { makeInternalSwaypageLink } = useSwaypageLinks()

// TODO changing these should affect routing
const swaypageMenu = [
  [{
    label: 'Swaypages',
    icon: 'i-heroicons-document',
    click: () => selectedType.value = swaypageMenu[0][0]
  }, {
    label: 'Templates',
    icon: 'i-heroicons-bookmark',
    click: () => selectedType.value = swaypageMenu[0][1]
  }, {
    label: 'Archive',
    icon: 'i-heroicons-archive-box',
    click: () => selectedType.value = swaypageMenu[0][2]
  }],
]
const selectedType = ref(swaypageMenu[0][0])

const roomTypeMap = {
  'deal-room': 'Swaypages',
  'template': 'Template'
}

const activeRooms = computed(() => 
  orderBy(
    filter(swaypages.value,
      s => s.status !== 'archived' && s.roomType === 'deal-room'),
    ['updatedAt'],
    ['desc']
  )
)

const templateRooms = computed(() => 
  orderBy(
    filter(swaypages.value,
      s => s.status !== 'archived' && s.roomType === 'template'),
    ['updatedAt'],
    ['desc']
  )
)

const archiveRooms = computed(() => 
  orderBy(
    filter(swaypages.value,
      s => s.status === 'archived'),
    ['updatedAt'],
    ['desc']
  )
)

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

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

<style lang="postcss" scoped>
.room-grid {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  
  &.active-rooms {
    grid-template-columns: repeat(6, 1fr);
  }

  &.template-rooms {
    grid-template-columns: repeat(3, 1fr);
  }

  &.archive-rooms {
    grid-template-columns: repeat(5, 1fr);
  }
}

.cell {
  @apply py-2 relative flex flex-row items-center gap-2;

  &::after {
    @apply absolute bg-gray-200 h-[1px] w-screen;
    content: '';
    inset-inline-start: -5rem;
    inset-block-start: 0;
  }
}

.template-grid {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  grid-template-columns: repeat(2, 1fr);
}

.group:hover {
  .cell {
    @apply bg-gray-100 -mx-4 px-4
  }

  .cell:first-child {
    @apply -ml-8 pl-8
  }

  .cell:last-child {
    @apply -mr-8 pr-8
  }
}
</style>
