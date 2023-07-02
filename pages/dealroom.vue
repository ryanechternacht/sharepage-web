<template>
  <div>
    <div class="dealroom-grid">
      <!-- row 1 col 1 -->
      <div class="flex flex-col gap-y-2">
        <div class="flex flex-row items-center gap-x-3">
          <img class="deal-logo" :src="deal?.logo" />
          <h3>{{ deal?.name }}</h3>
          <div class="flex-grow" />
          <h5>{{ deal?.status }}</h5>
        </div>

        <div class="flex flex-row items-center gap-x-1">
          <img class="seller-logo" src="/svg/gong.svg" />
          <div class="gray">Gong</div>
          <template v-if="deal?.partners">
            <div class="gray">&</div>
            <img class="seller-logo" :src="deal?.partners[0]?.logo" />
            <div class="gray">{{ deal?.partners[0].name }}</div>
          </template>
        </div>
      </div>

      <!-- row 1 col 2 -->
      <Tabs
        :tabs="mainTabs"
        :selected-tab="selectedMainTab"
        @new-tab-selected="selectedMainTab = $event.tab"
      />

      <!-- row 1 col 3 -->
      <Tabs
        :tabs="sideTabs"
        :selected-tab="selectedSideTab"
        @new-tab-selected="selectedSideTab = $event.tab"
      />

      <!-- row 2 col 1 -->
      <div class="flex flex-col gap-y-3">
        <section>
          <p class="mb-2">How we win together</p>
          <div class="gray">Empowering sales teams to deliver personalized and impactful 
            interactions that drive increased customer engagement and sales success.
          </div>
        </section>
        <section>
          <p class="mb-2">Bank of America Revenue Team</p>

          <PersonList :people="deal?.customerTeam" />
        </section>
        <section v-for="p in deal?.partners">
          <p class="mb-2">{{ p.name }} Revenue Team</p>

          <PersonList :people="p.team" />
        </section>
        <section>
          <p class="mb-2">Our Revenue Team</p>

          <PersonList :people="deal?.ourTeam" />
        </section>
      </div>

      <!-- row 2 col 2 -->
      <!-- TODO this should probably be routing based -->
      <div class="bg-white rounded-md p-6">
        <DealroomOverview
          v-if="selectedMainTab === 'Overview'"
          :overview="deal?.pages.overview"
          @update:overview="saveOverview"
        />
        <DealroomJointValue
          v-else-if="selectedMainTab === 'Joint Value'"
        />
        <DealroomPartner
          v-else-if="deal?.partners?.find(p => p.name === selectedMainTab)"
          :partner="selectedMainTab"
        />
      </div>

      <!-- row 2 col 3 -->
      <!-- TODO should this be routing based? -->
      <div class="bg-white rounded-md p-6">
        <DealroomActivities
          v-if="selectedSideTab === 'Activities'"
        />
        <DealroomComms
          v-else-if="selectedSideTab === 'Comms'"
        />
        <DealroomMeetings
          v-else-if="selectedSideTab === 'Meetings'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrbitsStore } from '@/stores/orbits'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'

const orbitId = 1

const store = useOrbitsStore()
const { getById, orbits } = storeToRefs(store)
await store.fetchOrbit({ orbitId })
const deal = ref(getById.value(orbitId))

store.$subscribe(() => {
  deal.value = getById.value(orbitId)
})

const mainTabs = computed(() => {
  const tabs = ['Overview', 'Joint Value']
  const extra = deal.value?.partners ? deal.value.partners.map(p => p.name) : []
  tabs.push(...extra)
  return tabs
})

const selectedMainTab = ref('Overview')

const sideTabs = ['Activities', 'Comms', 'Meetings']
const selectedSideTab = ref(sideTabs[0])

function saveOverview (overview) {
  const clone = cloneDeep(deal.value)
  clone.pages.overview = overview
  store.save(clone)
}
</script>

<style lang="postcss" scoped>
.dealroom-grid {
  @apply grid gap-x-6 gap-y-3;
  grid-template-rows: auto 1fr;
  grid-template-columns: 300px 1fr 300px; 
}

section {
  @apply bg-white rounded-md py-3 px-4;
}
</style>

<style lang="postcss">
.full-page {
  /* @apply bg-red-light; */
}

.deal-logo {
  @apply h-10;
}

.seller-logo {
  @apply h-4;
}

.tag.selected {
  @apply border-b border-gray pb-0.5;
}
</style>