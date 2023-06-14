<template>
  <div>
    <div class="dealroom-grid">
      <!-- row 1 col 1 -->
      <div class="flex flex-col gap-y-2">
        <div class="flex flex-row items-center gap-x-3">
          <img class="deal-logo" src="/svg/boa.svg" />
          <h3>Bank of America</h3>
          <div class="flex-grow" />
          <h5>Active</h5>
        </div>

        <div class="flex flex-row items-center gap-x-1">
          <img class="seller-logo" src="/svg/gong.svg" />
          <div class="gray">Gong</div>
          <div class="gray">&</div>
          <img class="seller-logo" src="/svg/seismic.svg" />
          <div class="gray">Seismic</div>
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

          <PersonList :people="gongTeam" />
        </section>
        <section>
          <p class="mb-2">Gong Revenue Team</p>

          <PersonList :people="gongTeam" />
        </section>
        <section>
          <p class="mb-2">Our Revenue Team</p>

          <PersonList :people="ourTeam" />
        </section>
      </div>

      <!-- row 2 col 2 -->
      <!-- TODO this should probably be routing based -->
      <div class="bg-white rounded-md p-6">
        <DealroomOverview
          v-if="selectedMainTab === 'Overview'"
        />
        <DealroomJointValue
          v-else-if="selectedMainTab === 'Joint Value'"
        />
        <DealroomPartner
          v-else-if="partners.includes(selectedMainTab)"
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
const boaTeam = [{
  name: 'Walter White',
  title: 'Account Executive',
  linkedIn: 'https://google.com'
}, {
  name: 'Cara Winslow',
  title: 'Partnerships Manager',
  linkedIn: 'https://google.com'
}, {
  name: 'Jack Gopher',
  title: 'Marketing Expert',
}, {
  name: 'Gary Busy',
  title: 'Product Expert',
  linkedIn: 'https://google.com'
}]

const gongTeam = [{
  name: 'Walter White',
  title: 'Account Executive',
  linkedIn: 'https://google.com'
}, {
  name: 'Cara Winslow',
  title: 'Partnerships Manager',
  linkedIn: 'https://google.com'
}, {
  name: 'Jack Gopher',
  title: 'Marketing Expert',
}, {
  name: 'Gary Busy',
  title: 'Product Expert',
  linkedIn: 'https://google.com'
}]

const ourTeam = [{
  name: 'Rebekah Black',
  title: 'Account Executive',
  linkedIn: 'https://google.com'
}, {
  name: 'Carrot Toppe',
  title: 'Partnerships Manager',
  linkedIn: 'https://google.com'
}, {
  name: 'Jeremy Hunt',
  title: 'Marketing Expert',
  linkedIn: 'https://google.com'
}, {
  name: 'Gabriella Lopez',
  title: 'Product Expert',
}]

const partners = ['Seismic'];

const mainTabs = ['Overview', 'Joint Value'];
mainTabs.push(...partners)
const selectedMainTab = ref(mainTabs[0])

const sideTabs = ['Activities', 'Comms', 'Meetings']
const selectedSideTab = ref(sideTabs[0])
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
  @apply bg-red-light;
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