<template>
  <div>
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
            <Component :is="filterOption.icon" class="subtext" />
            <div class="subtext flex flex-row items-center cursor-pointer">
              {{ filterOption.text }} 
              <ChevronDownIcon class="icon-submenu" />
            </div>
          </div>
        </template>
        <template #body>
          <div class="dropdown-menu">
            <div v-for="filterOption in filterOptions" 
              class="dropdown-item"
              dropdown-closer
              @click="setFilter(filterOption.key)">
              <Component :is="filterOption.icon" class="icon-menu" />  
              {{ filterOption.text }}
            </div>
          </div>
        </template>
      </dropdown-menu>
    </div>

    <UButton>hello world</UButton>
    <div class="bg-primary-500 w-[1rem] h-[1rem]" />

    <div v-if="filterOption.key === 'active'" 
      class="room-grid active-rooms">
      <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

      <NuxtLink class="contents cursor-pointer group" v-for="swaypage in activeRooms"
        :to="makeNewSwaypageLink(swaypage)">
        <div class="cell">{{ swaypage.buyer }}</div>
        <div class="cell subtext">{{ swaypage.subname }}</div>
        <div class="cell subtext">
          <template v-if="swaypage.owner">
            <UserAvatar :user="swaypage.owner" />
            {{ swaypage.owner.firstName }} {{ swaypage.owner.lastName }} 
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
        <div class="cell">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
      </NuxtLink>
    </div>

    <div v-else-if="filterOption.key === 'templates'" 
      class="room-grid template-rooms">
      <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

      <NuxtLink class="contents cursor-pointer group" v-for="swaypage in templateRooms"
        :to="makeNewSwaypageLink(swaypage)">
        <div class="cell">{{ swaypage.buyer }}</div>
        <div class="cell subtext">
          <template v-if="swaypage.owner">
            <UserAvatar :user="swaypage.owner" />
            {{ swaypage.owner.firstName }} {{ swaypage.owner.lastName }} 
          </template>
        </div>
        <div class="cell">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
      </NuxtLink>
    </div>

    <div v-if="filterOption.key === 'archive'" 
      class="room-grid archive-rooms">
      <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Room Type</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

      <NuxtLink class="contents cursor-pointer group" v-for="swaypage in archiveRooms"
        :to="makeNewSwaypageLink(swaypage)">
        <div class="cell">{{ swaypage.buyer }}</div>
        <div class="cell subtext">{{ swaypage.subname }}</div>
        <div class="cell subtext">
          <template v-if="swaypage.owner">
            <UserAvatar :user="swaypage.owner" />
            {{ swaypage.owner.firstName }} {{ swaypage.owner.lastName }} 
          </template>
        </div>
        <div class="cell subtext">{{ roomTypeMap[swaypage.roomType] }}</div>
        <div class="cell">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { concat, filter, find, map, orderBy } = lodash_pkg;

const { apiFetch } = useNuxtApp()
const { data: swaypages } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})

const { makeNewSwaypageLink } = useSwaypageLinks()

const filterOptions = [
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
const filterOption = ref(filterOptions[0])

const roomTypeMap = {
  'deal-room': 'Deal Room',
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

// TODO changing these should affect routing
function setFilter (newType) {
  filterOption.value = find(filterOptions, rt => rt.key === newType)
}

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.room-grid {
  @apply grid px-8 gap-x-8 border border-gray-border rounded-md overflow-hidden;
  
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
    @apply absolute bg-gray-border h-[1px] w-screen;
    content: '';
    inset-inline-start: -5rem;
    inset-block-start: 0;
  }
}

.template-grid {
  @apply grid px-8 gap-x-8 border border-gray-border rounded-md overflow-hidden;
  grid-template-columns: repeat(2, 1fr);
}

.group:hover {
  .cell {
    @apply bg-gray-border-light -mx-4 px-4
  }

  .cell:first-child {
    @apply -ml-8 pl-8
  }

  .cell:last-child {
    @apply -mr-8 pr-8
  }
}

.dropdown-item {
  /* ryan */
  @apply flex flex-row items-center gap-2;
  /* @apply flex flex-row items-center gap-2 subtext; */
}
</style>
