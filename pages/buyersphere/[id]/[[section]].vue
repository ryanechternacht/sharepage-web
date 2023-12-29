<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="page-top"
        :class="{ 'grayscale-top': !isActive }">
        <div class="mt-8 flex flex-row items-center justify-center gap-2">
          <img :src="buyersphere.buyerLogo" class="h-[1.25rem]">
          <h3>{{ buyersphere.buyer }}</h3>
        </div>
        <div class="mt-8 mb-10 flex flex-row items-center justify-center gap-1 leading-none">
          <h1>Our</h1>
          <h1 class="bg-purple-secondary text-white rounded-md px-1 py-[1px]">
            {{ mainSection.replace('-', ' ') }}
          </h1>
        </div>
        <!-- <div class="flex flex-col gap-4 pl-8 pb-5">
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
              @click="reactivate">Reactivate</Tag2>
          </div>
        </div> -->
      </div>

      <!-- These return the left, center, left-header, and center-header sections -->
      <BuyersphereDiscoveryGuide v-if="mainSection === 'discovery-guide'" />
      <BuyersphereActivityPlan v-else-if="mainSection === 'activity-plan'" />
      <BuyersphereTeam v-else-if="mainSection === 'team'" />
      <BuyersphereInsights v-else-if="mainSection === 'insights'" />
      <BuyersphereAssets v-else-if="mainSection === 'assets'" />
      <BuyersphereNotes v-else-if="mainSection === 'notes'" />

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const [buyersphere, conversations] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
])

const isActive = computed(() => buyersphere.status === 'active')

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMMM Do')
}

const mainSection = computed(
  () => route.params.section ? route.params.section : 'discovery-guide')

function putOnHold() {
  const answer = confirm(`Are you sure you'd like to put this buying process on hold?`)

  if (answer) {
    buyersphereStore.saveStatus({ buyersphereId, status: "on-hold" })
  }
}

function reactivate() {
  const answer = confirm(`Are you sure you want to reactive the buying process?`)
  
  if (answer) {
    buyersphereStore.saveStatus({ buyersphereId, status: "active" })
  }
}

// TODO we may want a way to get these directly, without having to filter
// all activities
const milestones = computed(() => 
  orderBy(
    filter(conversations, c => c.collaborationType === 'milestone'),
    ['dueDate'],
    ['asc']
  ))

const nextMilestone = computed(() => find(milestones.value, m => !m.resolved))
</script>

<style lang="postcss" scoped>
.page-top {
  @apply bg-purple-background px-10;
  grid-area: top;

  &.grayscale-top {
    @apply bg-gray-border;
  }
}

.white-box {
  @apply p-1 px-2 bg-white rounded-md text-gray-subtext;
}

.milestone {
  @apply grid;
  grid-template-areas: 
    "step icon"
    "date icon";
  
  &.selected {
    @apply bg-gray-hover rounded-md mr-[-.25rem] pr-1;
  }

  .milestone-step {
    @apply [grid-area:step] text-right px-2;
  }

  .milestone-date {
    @apply [grid-area:date] text-right tag px-2;
  }

  .milestone-icon {
    @apply [grid-area:icon] self-center px-1 w-[1.375rem];
  }
}
</style>
