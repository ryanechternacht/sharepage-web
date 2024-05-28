<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-6">
      <h1>Feed</h1>
      <div class="flex-grow" />
        <!-- TODO implement -->
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
        <div class="subtext">Internal Only</div>
      </div>
      <dropdown-menu
        direction="right"
        :overlay="false"
        with-dropdown-closer
        @opened="isDropdownOpen = true"
        @closed="isDropdownOpen = false">
        <template #trigger>
          <UIcon name="i-heroicons-ellipsis-vertical" />
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
        <h2 class="h-[3rem] flex flex-row items-center">Lead</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Event</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Event Time</h2>

        <template v-for="session in buyerSessions">
          <div class="cell">{{ session?.linkedName }}</div>
          <div class="cell">
            <div class="timing-grid">
              <div v-for="timing in session.timings"
                class="contents group">
                <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                  <SwaypageTimingTag :timing="timing" />
                </div>
                <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                  <SwaypagePageTag :event="timing" />
                </div>
              </div>
              <div v-for="event in session.events"
                class="contents group">
                <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                  <SwaypageEventTag :event="event" />
                </div>
                <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                  <SwaypagePageTag :event="event" />
                </div>
              </div>
            </div>
          </div>
          <div class="cell">{{ prettyFormatDate(session.createdAt) }}</div>
        </template>
      </div>
    </div>
  </div>     
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'

definePageMeta({
  name: 'feed',
  middleware: ['enforce-seller'],
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

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
  overflow: hidden;
}

.feed-grid {
  @apply grid px-8 gap-x-8;
  grid-template-columns: auto 1fr auto;

  .cell {
    @apply py-2 relative flex flex-row items-center;
  
    &::after {
      @apply absolute bg-gray-200 h-[1px] w-screen;
      content: '';
      inset-inline-start: -5rem;
      inset-block-start: 0;
    }
  }
}

.timing-grid {
  @apply grid w-full -my-2;
  grid-template-columns: 1fr 1fr;
}
</style>
