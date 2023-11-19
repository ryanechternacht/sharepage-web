<template>
  <div class="page-layout">
    <div class="page-top">
      <TopNav class="col-span-2"/>
      <div class="flex flex-col gap-4 pl-8 pb-5">
        <div class="flex flex-row items-center gap-2">
          <Logo :src="buyersphere.buyerLogo"
            size="medium"
            class="mr-2" />
          <h3 class="text-gray-darker">{{ buyersphere.buyer }}</h3>
          <div class="white-box inline-flex text-[.625rem]">
            <img src="/svg/person.svg"> &nbsp;
            {{ buyersphere.buyerTeam.length }}
          </div>
          <div class="white-box">+</div>
        </div>
        <div class="flex flex-row items-center gap-2">
          <Logo :src="organization.logo"
            size="medium"
            class="mr-2" />
          <h3 class="text-gray-darker">{{ organization.name }}</h3>
          <div class="white-box inline-flex text-[.625rem]">
            <img src="/svg/person.svg"> &nbsp;
            {{ buyersphere.sellerTeam.length }}
          </div>
          <div class="white-box">+</div>
        </div>
      </div>
      <div class="flex flex-col items-end mr-8 mb-4">
        <div class="tag text-gray-mid">By {{ formatDate(buyersphere.decisionDate) }}</div>
        <h3>Current Stage: {{ capitalize(buyersphere.currentStage) }}</h3>
        <div class="mt-2 flex flex-row gap-4">
          <Tag2 color="teal" :use-dot="true">Next Stage</Tag2>
          <Tag2 color="orange" :use-dot="true">Put on Hold</Tag2>
        </div>
      </div>
    </div>
    <div class="page-left">
      <div class="p-2 flex flex-col gap-1 bg-gray-lightest border border-gray-lighter rounded-md">
        <NuxtLink :to="makeInternalBuyersphereLink('map')"
          class="page-link">🤔 &nbsp; MAP</NuxtLink>
        <hr>
        <NuxtLink :to="makeInternalBuyersphereLink('introduction')"
          class="page-link">👋 &nbsp; Introduction</NuxtLink>
        <hr>
        <NuxtLink :to="makeInternalBuyersphereLink('personas')"
          class="page-link">🥸 &nbsp; Personas</NuxtLink>
        <NuxtLink :to="makeInternalBuyersphereLink('solution')"
          class="page-link">🚀 &nbsp; Solution</NuxtLink>
        <NuxtLink :to="makeInternalBuyersphereLink('features')"
          class="page-link">🤖 &nbsp; Features</NuxtLink>
        <NuxtLink v-if="buyersphere.showPricing"
          :to="makeInternalBuyersphereLink('pricing')"
          class="page-link">💵 &nbsp; Pricing</NuxtLink>
        <hr>
        <NuxtLink :to="makeInternalBuyersphereLink('notes')"
          class="page-link">📒 &nbsp; Notes</NuxtLink>
        <NuxtLink :to="makeInternalBuyersphereLink('resources')"
          class="page-link">📓 &nbsp; Resources</NuxtLink>
      </div>
    </div>
    <div class="page-center">
      <InternalBuyersphereMutualActionPlan v-if="mainSection === 'map'" />
      <BuyersphereOverview v-if="mainSection === 'introduction'" />
      <InternalBuyerspherePersonas v-if="mainSection === 'personas'" />
      <InternalBuyersphereSolution v-if="mainSection === 'solution'" />
      <BuyersphereFeatures v-if="mainSection === 'features'" />
      <BuyerspherePricing v-if="mainSection === 'pricing'"
        :buyersphere="buyersphere" />
      <BuyersphereNotes v-if="mainSection === 'notes'"
        :notes="buyersphere.notes" />
      <BuyersphereResources v-if="mainSection === 'resources'"
        :resources="buyersphere.resources" />
    </div>
    <div class="page-right">right</div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { capitalize, concat, filter, find, groupBy, map, orderBy, reduce } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, conversations, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
])

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMMM Do')
}

const completedItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => c.resolved),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['desc']
  )
)

var nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

const activeItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => !c.resolved && new Date(c.dueDate) < nextWeek),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['asc']
  )
)

const upcomingItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => !c.resolved && new Date(c.dueDate) >= nextWeek),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['asc']
  )
)

function getGroupCount(group) {
  return reduce(group, (acc, { items }) => acc + items.length, 0) || "-";
}

const completedItemCount = computed(() => getGroupCount(completedItemsGrouped.value))
const activeItemCount = computed(() => getGroupCount(activeItemsGrouped.value))
const upcomingItemsCount = computed(() => getGroupCount(upcomingItemsGrouped.value))

const mainSection = computed(
  () => route.params.section ? route.params.section : 'introduction')

function makeInternalBuyersphereLink(section) {
  return section === 'introduction'
    ? `/internal/buyersphere/${route.params.id}`
    : `/internal/buyersphere/${route.params.id}/${section}`
}
</script>

<style lang="postcss" scoped>
.page-layout {
  @apply grid gap-y-8;
  grid-template-rows: auto 1fr;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas:
    "top  top    top"
    "left center right";
}

.page-top {
  /* @apply bg-gradient-to-r from-teal-background to-blue-background; */
  @apply bg-center bg-no-repeat grid grid-cols-2 gap-y-4;
  grid-template-rows: auto auto;
  background-image: url("/svg/logo-background.svg"), 
    linear-gradient(to right, #ecf9f8, #e7ebfd); /* teal-background, blue-background */
  grid-area: top;
}

.white-box {
  @apply p-1 px-2 bg-white rounded-md text-gray-mid;
}

.page-left {
  @apply px-6;
  grid-area: left;

  hr {
    @apply text-gray-lighter;
  }
}

.page-link {
  @apply py-1 cursor-pointer;

  &:hover {
    @apply bg-gray-lighter rounded-md;
  }
}

.page-center {
  grid-area: center;
}

.page-right {
  grid-area: right;
}
</style>
