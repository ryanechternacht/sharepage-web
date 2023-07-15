<template>
  <div>
    <div class="dealroom-grid">
      <!-- row 1 col 1 -->
      <section class="h-100% flex flex-col justify-items-center gap-2">
        <div class="logo-section section">
          <Logo
            :src="buyersphere.buyerLogo"
            size="large"
            style="grid-area: logo" />
          <h3 style="grid-area: company">{{ buyersphere.buyer }}</h3>
          <Tag
            bg="bg-gray-light"
            width="3.75rem"
            height="0.75rem"
            style="grid-area: label">Buyer</Tag>
        </div>
        <div class="logo-section">
          <Logo
            :src="organization.logo"
            size="large"
            style="grid-area: logo" />
          <h3 style="grid-area: company">{{ organization.name }}</h3>
          <Tag
            bg="bg-gray-light"
            width="3.75rem"
            height="0.75rem"
            style="grid-area: label">Seller</Tag>
        </div>
      </section>

      <!-- row 1 col 2 -->
      <section>
        <BuyersphereDealStage />
      </section>

      <!-- row 1 col 3 -->
      <section class="flex flex-col">
        <div class="flex-grow flex flex-row justify-between items-center">
          <h3>Qualification by:</h3>
          <h3 class="text-purple">June 28th</h3>
        </div>
        <div class="flex-grow flex flex-row justify-between items-center">
          <div class="gray">+ ACTION</div>
          <div class="gray">+ NOTE</div>
          <div class="gray">+ RESOURCE</div>
        </div>
      </section>

      <!-- row 2 col 1 -->
      <div>
        <section>
          <div class="mb-2 flex flex-row items-center gap-x-4">
            <Logo :src="buyersphere.buyerLogo" />
            <h3>{{ buyersphere.buyer }}</h3>
          </div>
          <PersonList :people="buyersphere.buyerTeam" />

          <div class="mt-4 mb-2 flex flex-row gap-x-4">
            <Logo src="/house_stark.png" />
            <h3 class="">House Stark Team</h3>
          </div>
          <PersonList :people="buyersphere.sellerTeam" />
        </section>
      </div>

      <!-- row 2 col 2 -->
      <!-- TODO this should probably be routing based -->
      <div>
        <section>
          <div class="w-full justify-center flex flex-row items-center gap-x-4 mb-4">
            <NuxtLink :to="`/buyersphere/${route.params.id}`">OVERVIEW</NuxtLink>
            <NuxtLink :to="`/buyersphere/${route.params.id}/features`">FEATURES</NuxtLink>
            <NuxtLink :to="`/buyersphere/${route.params.id}/contact`">CONTACT YOUR TEAM</NuxtLink>
          </div>
          <BuyersphereOverview
            v-if="route.params.section === ''"
            :intro-message="buyersphere.introMessage"
            @update:overview="saveOverview"
          />
          <BuyersphereFeatures
            v-else-if="route.params.section === 'features'"
          />
          <!-- <BuyersphereContact
            v-else-if="route.params.section === 'contact'"
            :partner="selectedMainTab"
          /> -->
        </section>
      </div>

      <!-- row 2 col 3 -->
      <!-- TODO should this be routing based? -->
      <div>
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
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: "buyersphere",
});

// const customerTeam = ref([{
//   name: 'Walter White',
//   title: 'Account Executive',
//   linkedIn: 'https://google.com'
// }, {
//   name: 'Cara Winslow',
//   title: 'Partnerships Manager',
//   linkedIn: 'https://google.com'
// }, {
//   name: 'Jack Gopher',
//   title: 'Marketing Expert',
// }, {
//   name: 'Gary Busy',
//   title: 'Product Expert',
//   linkedIn: 'https://google.com'
// }])
// const ourTeam = ref([{
//   name: 'Rebekah Black',
//   title: 'Account Executive',
//   linkedIn: 'https://google.com'
// }, {
//   name: 'Carrot Toppe',
//   title: 'Partnerships Manager',
//   linkedIn: 'https://google.com'
// }, {
//   name: 'Jeremy Hunt',
//   title: 'Marketing Expert',
//   linkedIn: 'https://google.com'
// }, {
//   name: 'Gabriella Lopez',
//   title: 'Product Expert',
// }])

const route = useRoute()
const buyersphereId = route.params.id

const store = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(store)
const buyersphere = await getBuyersphereByIdCached.value(buyersphereId)  

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)
const organization = await getOrganizationCached.value()

store.$subscribe(() => {
  buyersphere.value = getById.value(buyersphereId)
})

const sideTabs = ['Activities', 'Comms', 'Meetings']
const selectedSideTab = ref(sideTabs[0])

function saveOverview (overview) {
  const clone = cloneDeep(buyersphere.value)
  clone.pages.overview = overview
  store.save(clone)
}
</script>

<style lang="postcss" scoped>
.dealroom-grid {
  @apply grid gap-x-4 gap-y-3;
  grid-template-rows: auto 1fr;
  grid-template-columns: 274px 1fr 274px; 
}

section {
  @apply bg-white rounded-md py-2 px-3;
}

.logo-section {
  @apply grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  grid-template-areas: "logo company" "logo label";
}

.deal-logo {
  @apply w-[2.25rem] h-[2.25rem] flex flex-col items-center;
  grid-area: logo;

  * {
    @apply max-h-[2.25rem] max-w-[2.25rem];
  }
}

.tag.selected {
  @apply border-b border-gray pb-0.5;
}

.router-link-active {
  @apply bg-purple rounded-full text-white px-2 py-[1px];
}
</style>
