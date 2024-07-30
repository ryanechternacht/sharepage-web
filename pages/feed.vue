<template>
  <div>
    <TopNav>
      <template #action-button>
        <!-- <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton> -->
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <div>
        <div class="flex flex-row items-center gap-4">
          <h1>Feed</h1>
          <div class="flex flex-row items-center gap-2">
            <UIcon class="subtext icon-menu" name="i-heroicons-signal" />
            <div class="subtext">All events</div>
          </div>
          <!-- <dropdown-menu
            :overlay="false"
            with-dropdown-closer
            @opened="isDropdownOpen = true"
            @closed="isDropdownOpen = false">
            <template #trigger>
              <div class="flex flex-row items-center gap-2">
                <Component :is="filterOption.icon" class="subtext" />
                <div class="subtext flex flex-row items-center cursor-pointer">
                  {{ filterOption.text }} 
                  <UIcon class="icon-submenu" name="i-heroicons-chevron-down" />
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
          </dropdown-menu> -->
        </div>

        <div class="page-area">
          <div class="feed-grid">
            <div><!-- intentionally blank --></div>
            <h2 class="h-[3rem] flex flex-row items-center">Lead</h2>
            <h2 class="h-[3rem] flex flex-row items-center">Event</h2>
            <h2 class="h-[3rem] flex flex-row items-center">Sharepage</h2>
            <h2 class="h-[3rem] flex flex-row items-center">Event Time</h2>

            <template v-for="session in buyerSessions">
              <div class="cell">
                <SharepagePriorityTag :priority="session.buyersphere.priority" />
              </div>
              <div class="cell">{{ session?.linkedName }}</div>
              <div class="cell">
                <div class="timing-grid">
                  <div v-for="timing in session.timings"
                    class="contents group">
                    <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                      <SharepageTimingTag :timing="timing" />
                    </div>
                    <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                      <SharepageThreadTag :event="timing" />
                    </div>
                  </div>
                  <div v-for="event in session.events"
                    class="contents group">
                    <div class="p-2 group-hover:bg-gray-100 flex flex-row items-start">
                      <SharepageEventTag :event="event" />
                    </div>
                    <div class="p-2 pr-8 group-hover:bg-gray-100 flex flex-row items-start">
                      <SharepageThreadTag :event="event" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="cell gap-2">
                <Logo :src="session.buyersphere.buyerLogo" class="icon-menu" />
                <div class="subtext">{{ session.buyersphere.buyer }}</div>
              </div>
              <div class="cell subtext">{{ prettyFormatDate(session.createdAt) }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useNuxtApp()
const { data: buyerSessions } = await apiFetch('/v0.1/buyer-sessions', { 
  // query
})

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
  overflow: hidden;
}

.feed-grid {
  @apply grid px-8 gap-x-8;
  grid-template-columns: auto auto 1fr auto auto;

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
