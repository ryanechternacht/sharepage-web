<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <h3 class="page-link">Discovery Guide</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 @click="navigateTo('#success-criteria')"
          class="in-page-link">Success Criteria</h4>
        <h4 @click="navigateTo('#objectives')"
          class="in-page-link">Objectives</h4>
        <h4 @click="navigateTo('#features')"
          class="in-page-link">Features</h4>
        <h4 @click="navigateTo('#pricing')"
          class="in-page-link">Pricing</h4>
        <h4 @click="navigateTo('#constraints')"
          class="in-page-link">Constraints</h4>
        <h4 @click="navigateTo('#milestones')"
          class="in-page-link">Milestones</h4>
      </div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/team`)">Team</div>
        <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/assets`)">Assets</div>
      <div v-if="isSeller"
        class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/insights`)">Insights</div>
      </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div id="success-criteria"
      class="section">
      <div class="group-header">Success Criteria</div>
      
      <h4>How will you measure success?</h4>
      <AutoSaveTipTapTextarea :model-value="successCriteria"
        placeholder="Pain points to resolve"
        class="w-full mb-4"
        :on-update-fn="updateSuccessCriteriaAnswer" />
    </div>
    
    <div id="objectives"
      class="section">
      <div class="group-header">Objectives</div>
      <h4>These are the core problems we solve</h4>
      <div class="item-list">
        <div v-for="pp in painPoints"
          class="item-list-row">
          <img src="/svg/gift-tag.svg">
          <Tag2 class="whitespace-nowrap" color="blue">{{ pp.title }}</Tag2>
          <div class="inline-html tag" v-html="pp.description" />
        </div>
      </div>

      <h4>Which objectives are most important for you? Are any not covered above?</h4>
      <AutoSaveTipTapTextarea :model-value="objectives"
        placeholder="Ex: We have the objective to have unanimous agreement as a buying committee"
        class="w-full mb-4"
        :on-update-fn="updateObjectivesAnswer" />
    </div>

    <div id="features"
      class="section">
      <div class="group-header">Features</div>
      <h4>Select which features are most/least important to you</h4>
      <div class="flex flex-col gap-4">
        <div v-for="f in features"
          class="feature-list">
          <div><!-- empty --></div>
          <h3>{{ f.title }}</h3>
          <div class="justify-center flex flex-row items-center gap-2">
            <div class="feature-button feature-button-yes"
              :class="{'selected': myFeatures?.interests[f.id] === 'yes'}"
              @click="saveFeatureInterest(f.id, 'yes')">
              <img v-if="myFeatures?.interests[f.id] === 'yes'" src="/svg/checkmark--green.svg">
              <img v-else src="/svg/checkmark.svg">
            </div>
            <div class="feature-button feature-button-maybe"
              :class="{'selected': myFeatures?.interests[f.id] === 'maybe'}"
              @click="saveFeatureInterest(f.id, 'maybe')">
              <img v-if="myFeatures?.interests[f.id] === 'maybe'" src="/svg/circle-dash--yellow.svg">
              <img v-else src="/svg/circle-dash.svg">
            </div>
            <div class="feature-button feature-button-no"
              :class="{'selected': myFeatures?.interests[f.id] === 'no'}"
              @click="saveFeatureInterest(f.id, 'no')">
              <img v-if="myFeatures?.interests[f.id] === 'no'" src="/svg/do-not-enter--red.svg">
              <img v-else src="/svg/do-not-enter.svg">
            </div>
          </div>
          <div class="gray inline-html" v-html="f.description" />
        </div>
      </div>
    </div>

    <div id="pricing"
      class="section">
      <div class="group-header">Pricing</div>
      <h4>Select the most appropriate tier</h4>
      <div class="pricing-tier-list">
        <div v-for="pt in pricingTiers"
          class="contents"
          :class="{'selected': pt.id === buyersphere.pricingTierId}"
          @click="updatePricingTierId(pt.id)">
          <img src="/svg/package.svg">
          <div>
            <div v-if="pt.id === buyersphere.pricingTierId"
              class="tag center-xy text-blue-primary h-full py-[2px] px-2">
              {{ pt.periodType === 'other'
                ? pt.amountOther
                : `${format(pt.amountPerPeriod, moneyConfig)}/${periodMap[pt.periodType]}` }}</div>
            <Tag2 v-else color="gray">
              {{ pt.periodType === 'other'
                ? pt.amountOther
                : `${format(pt.amountPerPeriod, moneyConfig)}/${periodMap[pt.periodType]}` }}
            </Tag2>
          </div>
          <h3 class="leading-[1.375rem]">{{ pt.title }}</h3>
          <div><!-- empty --></div>
          <div class="h-full"><!-- empty --></div>
          <div class="gray inline-html" v-html="pt.description" />
        </div>
      </div>
    </div>

    <div id="constraints"
      class="section">
      <div class="group-header">Constraints</div>
      <h4>Are there any constraints we should know about?</h4>
      <AutoSaveTipTapTextarea :model-value="keyConstraints"
        placeholder="Key constraints to buying"
        class="w-full mb-4"
        :on-update-fn="updateConstraintsAnswer" />
    </div>

    <div id="milestones"
      class="section">
      <div class="group-header">Milestones</div>
      <h4>What are the key milestone dates:</h4>
      <div class="item-list">
        <div v-for="m in milestones" 
          class="item-list-row">
          <img src="/svg/calendar.svg">
          <Tag2 v-if="m.resolved" 
            color="gray"
            class="w-[4.75rem]">Complete</Tag2>
          <Tag2 v-else 
            color="blue"
            class="w-[4.75rem]">{{ toDate(m.dueDate) }}</Tag2>
          <div class="flex-grow gray inline-html" v-html="m.message" />
          <div v-if="!m.resolved" class="tag">By {{ formatDate(m.dueDate) }}</div>
        </div>
      </div>
    </div>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { usePainPointsStore } from '@/stores/pain-points'
import { useFeaturesStore } from '@/stores/features'
import { usePricingStore } from '@/stores/pricing'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { format } from 'v-money3'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const [buyersphere, conversations, painPoints, features, { pricingTiers }, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
  getPainPointsCached.value(),
  getFeaturesCached.value(),
  getPricingCached.value(),
  isUserSeller.value(),
])

const periodMap = {
  'annually': 'yr',
  'monthly': 'mo',
  'per-seat': 'user'
}

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: '',
}

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM Do')
}

// is this worth doing for snappier UX? (probably)
const myFeatures = ref(buyersphere.featuresAnswer)

async function saveFeatureInterest (featureId, answer) {
  myFeatures.value.interests[featureId] = answer
  await buyersphereStore.updateBuyerInput({ buyersphereId, featuresAnswer: myFeatures })
}

async function updatePricingTierId (tierId) {
  await buyersphereStore.updateBuyerInput({ buyersphereId, pricingTierId: tierId })
}

const successCriteria = ref(buyersphere.successCriteriaAnswer.text)
const objectives = ref(buyersphere.objectivesAnswer.text)
const keyConstraints = ref(buyersphere.constraintsAnswer.text)

async function updateSuccessCriteriaAnswer(text) {
  await buyersphereStore.updateBuyerInput({ 
    buyersphereId, 
    successCriteriaAnswer: { text }
  })
}

async function updateObjectivesAnswer(text) {
  await buyersphereStore.updateBuyerInput({ 
    buyersphereId, 
    objectivesAnswer: { text }
  })
}

async function updateConstraintsAnswer(text) {
  await buyersphereStore.updateBuyerInput({ 
    buyersphereId, 
    constraintsAnswer: { text }
  })
}

// TODO do we need to filter this?
const milestones = computed(() => 
  orderBy(
    filter(conversations, c => c.collaborationType === 'milestone'),
    ['dueDate'],
    ['asc']
  ))

// TODO why didn't $dayjs form inlined in template work?
const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
function toDate (date) {
  const days = dayjs(date).diff(todayDayJs, 'days')
  return `${days} ${days === 1 ? 'day' : 'days'}`
}
</script>

<style lang="postcss" scoped>
.item-list {
  @apply flex flex-col gap-4;

  .item-list-row {
    @apply flex flex-row items-center gap-2;
  }
}

.feature-button {
  @apply p-2 rounded-md border border-gray-border cursor-pointer;

  &::before,
  &:hover::before {
    @apply absolute mt-[-2rem] tag
  }
}

.feature-button-yes {
  &:hover::before {
    @apply [content:"Yes"] ml-[-.25rem];
  }

  &.selected {
    @apply bg-green-background;

    &::before {
      @apply [content:"Yes"] ml-[-.25rem];
    }
  }
}

.feature-button-maybe {
  &:hover::before {
    @apply [content:"Maybe"] ml-[-.75rem];
  }

  &.selected {
    @apply bg-orange-background;

    &::before {
      @apply [content:"Maybe"] ml-[-.75rem];
    }
  }
}

.feature-button-no {
  &:hover::before {
    @apply [content:"No"];
  }

  &.selected {
    @apply bg-red-background;

    &::before {
      @apply [content:"No"];
    }
  }
}

.feature-list {
  @apply bg-white grid items-center gap-x-4 gap-y-1;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}

.pricing-tier-list {
  @apply grid cursor-pointer gap-y-1 gap-x-3 items-center;
  grid-template-columns: auto auto 1fr;

  /* vertical gap between sections */
  > div > *:nth-child(6n + 1),
  > div > *:nth-child(6n + 2),
  > div > *:nth-child(6n + 3) {
    @apply pt-1;
  }
  > div > *:nth-child(6n + 4),
  > div > *:nth-child(6n + 5),
  > div > *:nth-child(6n + 6) {
    @apply pb-1;
  }

  .selected {
    > *:nth-child(6n + 2) {
      @apply bg-blue-background mr-[-.75rem] pr-[.75rem] mb-[-.25rem] pb-[.25rem] 
        rounded-tl-md;
    }
    > *:nth-child(6n + 3) {
      @apply bg-blue-background mb-[-.25rem] pb-[.25rem] rounded-tr-md;
    }
    > *:nth-child(6n + 5) {
      @apply bg-blue-background mr-[-.75rem] pr-[.75rem] rounded-bl-md;
    }
    > *:nth-child(6n + 6) {
      @apply bg-blue-background rounded-br-md;
    }
  }
}
</style>
