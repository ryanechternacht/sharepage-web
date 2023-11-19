<template>
  <div class="page-layout">
    <div class="page-top"
      :class="{ 'grayscale-top': !isActive }">
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
        <div class="tag text-gray-mid">By {{ formatDate(nextStageDate) }}</div>
        <h3>Current Stage: {{ capitalize(buyersphere.currentStage) }}</h3>
        <div class="mt-2 flex flex-row gap-4">
          <template v-if="buyersphere.status === 'active'">
            <Tag2 color="teal" v-if="buyersphere.currentStage != 'adoption'"
              use-dot
              button
              @click="advanceStage">Next Stage</Tag2>
            <Tag2 color="orange" 
              use-dot
              button
              @click="putOnHold">Put on Hold</Tag2>
          </template>
          <Tag2 v-else
            color="teal"
            use-dot
            button
            class="reactivate-button"
            @click="reactiatve">Reactivate</Tag2>
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
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
])

const isActive = computed(() => buyersphere.status === 'active')

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMMM Do')
}

const mainSection = computed(
  () => route.params.section ? route.params.section : 'introduction')

function makeInternalBuyersphereLink(section) {
  return section === 'introduction'
    ? `/internal/buyersphere/${route.params.id}`
    : `/internal/buyersphere/${route.params.id}/${section}`
}

const nextStageDate = computed(
  () => ({
    'qualification': buyersphere.qualificationDate,
    'evaluation': buyersphere.evaluationDate,
    'decision': buyersphere.decisionDate,
  }[buyersphere.currentStage]))

function advanceStage() {
  const nextStage = {
    'qualification': 'evaluation',
    'evaluation': 'decision',
    'decision': 'adoption'
  }[buyersphere.currentStage]

  const answer = confirm(`Are you sure you'd like to proceed to the ${capitalize(nextStage)} stage?`)

  if (answer) {
    buyersphereStore.advanceStage({ buyersphereId, stage: nextStage})
  }
}

function updateStage(stage) {
  const answer = confirm(``)
}

function putOnHold() {
  const answer = confirm(`Are you sure you'd like to put this buying process on hold?`)

  if (answer) {
    buyersphereStore.saveStatus({ buyersphereId, status: "on-hold" })
  }
}

function reactiatve() {
  const answer = confirm(`Are you sure you want to reactive the buying process?`)
  
  if (answer) {
    buyersphereStore.saveStatus({ buyersphereId, status: "active" })
  }
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

  &.grayscale-top {
    background-image: url("/svg/logo-background.svg"), 
      linear-gradient(to right, #e7e7e7, #f5f5f5); /* above colors, after a 100% grayscale */
  }
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
