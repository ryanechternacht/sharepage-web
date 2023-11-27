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
          <h3 class="text-gray-headline">{{ buyersphere.buyer }}</h3>
          <div class="white-box inline-flex">
            <img src="/svg/person.svg"> &nbsp;
            {{ buyersphere.buyerTeam.length }}
          </div>
          <div class="white-box">+</div>
        </div>
        <div class="flex flex-row items-center gap-2">
          <Logo :src="organization.logo"
            size="medium"
            class="mr-2" />
          <h3 class="text-gray-headline">{{ organization.name }}</h3>
          <div class="white-box inline-flex">
            <img src="/svg/person.svg"> &nbsp;
            {{ buyersphere.sellerTeam.length }}
          </div>
          <div class="white-box">+</div>
        </div>
      </div>
      <div class="flex flex-col items-end mr-8 mb-4">
        <div class="tag text-gray-subtext">By {{ formatDate(nextStageDate) }}</div>
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
    <!-- These return both the left and center columns -->
    <InternalBuyersphereMap v-if="mainSection === 'map'" />
    <InternalBuyersphereProfile v-else-if="mainSection === 'intro'" />

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
  () => route.params.section ? route.params.section : 'map')

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
  /* @apply bg-gradient-to-r from-green-background to-blue-background; */
  @apply bg-center bg-no-repeat grid grid-cols-2 gap-y-4;
  grid-template-rows: auto auto;
  background-image: url("/svg/logo-background.svg"), 
    linear-gradient(to right, #ecf9f8, #e7ebfd); /* green-background, blue-background */
  grid-area: top;

  &.grayscale-top {
    background-image: url("/svg/logo-background.svg"), 
      linear-gradient(to right, #e7e7e7, #f5f5f5); /* above colors, after a 100% grayscale */
  }
}

.white-box {
  @apply p-1 px-2 bg-white rounded-md text-gray-subtext;
}

.page-dynamic {
  grid-area: dynamic;
}

.page-right {
  grid-area: right;
}
</style>
