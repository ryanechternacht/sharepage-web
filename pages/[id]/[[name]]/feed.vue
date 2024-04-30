<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-6">
      <h1>Feed</h1>
      <div class="flex-grow" />
        <!-- TODO implement -->
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <LockIcon class="text-orange-neutral icon-menu" />
        <div class="subtext">Internal Only</div>
      </div>
      <dropdown-menu
        direction="right"
        :overlay="false"
        with-dropdown-closer
        @opened="isDropdownOpen = true"
        @closed="isDropdownOpen = false">
        <template #trigger>
          <MoreVerticalIcon />
        </template>
        <template #body>
          <div class="dropdown-menu">
            <div class="dropdown-item"
              dropdown-closer
              @click="openPageSettingsModal()">Edit Page Settings</div>
            <div class="dropdown-item"
              dropdown-closer
              @click="openSwaypageSettingsModal()">Edit SwayPage Settings</div>
          </div>
        </template>
      </dropdown-menu>
    </div>
    <div class="page-area">
      <div class="feed-grid">
        <h2>Lead</h2>
        <h2>Event</h2>
        <h2>Event Time</h2>

        <template v-for="session in buyerSessions">
          <div>{{ session?.linkedName }}</div>
          <div>{{ reformatView(session) }}</div>
          <div>{{ session.createdAt }}</div>
        </template>
      </div>
    </div>
  </div>     
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, join, map, orderBy } = lodash_pkg;

definePageMeta({
  name: 'feed',
  layout: 'swaypage',
  // TODO middleware
})

const route = useRoute()
const swaypageId = parseInt(route.params.id)

const swaypagesStore = useSwaypagesStore()
const {
  getSwaypageBuyerSessionsByIdCached,
} = storeToRefs(swaypagesStore)

const [buyerSessions] = await Promise.all([
  getSwaypageBuyerSessionsByIdCached.value(swaypageId),
])

function reformatView (item) {
  return join(
    map(item.timings, i => `${i.title}: ${i.timeOnPage} seconds`),
    ' | '
  )
}
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-border-dark rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
  overflow: hidden;
}

.feed-grid {
  @apply grid px-8 gap-x-8;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: 3rem;

  div {
    @apply relative;
  
    &::after {
      @apply absolute bg-gray-border -start-12 h-[1px] w-screen;
      content: '';
    }
  }
}
</style>
