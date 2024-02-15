<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <h3 class="page-link">Discovery Guide</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <a class="in-page-link" href="#success-criteria">Success Criteria</a>
        <a class="in-page-link" href="#objectives">Objectives</a>
        <a class="in-page-link" href="#features">Features</a>
        <a class="in-page-link" href="#pricing">Pricing</a>
        <a class="in-page-link" href="#constraints">Constraints</a>
        <a class="in-page-link" href="#milestones">Milestones</a>
      </div>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'activity-plan')">Activity Plan</NuxtLink>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'team')">Team</NuxtLink>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'assets')">Assets</NuxtLink>
      <NuxtLink v-if="isSeller"
        class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'insights')">Insights</NuxtLink>
      </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div id="success-criteria"
      class="section">
      <div class="group-header">Success Criteria</div>
      
      <h4>How will you measure success?</h4>
      <AutoSaveTipTapTextarea :model-value="successCriteria"
        class="w-full mb-4"
        placeholder="Pain points to resolve"
        :readonly="!hasUser"
        :on-update-fn="updateSuccessCriteriaAnswer" />
    </div>
    
    <div id="objectives"
      class="section">
      <div class="group-header">Objectives</div>
      <h4>These are the core problems we solve</h4>
      <div class="item-list">
        <div v-for="pp in painPoints"
          class="item-list-row">
          <TagIcon class="w-[1rem] h-[1rem]"/>
          <Tag class="whitespace-nowrap" color="blue">{{ pp.title }}</Tag>
          <div class="inline-html tag" v-html="pp.description" />
        </div>
      </div>

      <h4>Which objectives are most important for you? Are any not covered above?</h4>
      <AutoSaveTipTapTextarea :model-value="objectives"
        class="w-full mb-4"
        placeholder="Ex: We have the objective to have unanimous agreement as a buying committee"
        :readonly="!hasUser"
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
              :class="{'selected': myFeatures?.interests[f.id] === 'yes',
                       'cursor-pointer': hasUser}"
              @click="saveFeatureInterest(f.id, 'yes')">
              <!-- TODO trying to combine the v-if/else here doesn't
                   render the color on update for some reason -->
              <CheckCircleIcon v-if="myFeatures?.interests[f.id] === 'yes'"
                class="[stroke:#08C4B2]" />
              <CheckCircleIcon v-else />
            </div>
            <div class="feature-button feature-button-maybe"
              :class="{'selected': myFeatures?.interests[f.id] === 'maybe',
                       'cursor-pointer': hasUser}"
              @click="saveFeatureInterest(f.id, 'maybe')">
              <MinusCircleIcon v-if="myFeatures?.interests[f.id] === 'maybe'"
                class="[stroke:#FFBC00]" />
              <MinusCircleIcon v-else />
            </div>
            <div class="feature-button feature-button-no"
              :class="{'selected': myFeatures?.interests[f.id] === 'no',
                       'cursor-pointer': hasUser}"
              @click="saveFeatureInterest(f.id, 'no')">
              <SlashIcon v-if="myFeatures?.interests[f.id] === 'no'"
                class="[stroke:#CE3665]" />
              <SlashIcon v-else />
            </div>
          </div>
          <div class="gray inline-html" v-html="f.description" />
        </div>
      </div>
    </div>

    <div v-if="buyersphere.showPricing" 
      id="pricing"
      class="section">
      <div class="group-header">Pricing</div>
      <h4>Select the most appropriate tier</h4>
      <div class="pricing-tier-list"
        :class="{'cursor-pointer': hasUser}">
        <div v-for="pt in pricingTiers"
          class="contents"
          :class="{'selected': pt.id === buyersphere.pricingTierId}"
          @click="updatePricingTierId(pt.id)">
          <PackageIcon class="w-[1rem] h-[1rem] "/>
          <div>
            <div v-if="pt.id === buyersphere.pricingTierId"
              class="tag center-xy text-blue-primary h-full py-[2px] px-2">
              {{ pt.periodType === 'other'
                ? pt.amountOther
                : `${format(pt.amountPerPeriod, moneyConfig)}/${periodMap[pt.periodType]}` }}</div>
            <Tag v-else color="gray">
              {{ pt.periodType === 'other'
                ? pt.amountOther
                : `${format(pt.amountPerPeriod, moneyConfig)}/${periodMap[pt.periodType]}` }}
            </Tag>
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
        class="w-full mb-4"
        placeholder="Key constraints to buying"
        :readonly="!hasUser"
        :on-update-fn="updateConstraintsAnswer" />
    </div>

    <div id="milestones"
      class="section">
      <div class="group-header">Milestones</div>
      <h4>What are the key milestone dates:</h4>
      <div class="item-list">
        <div v-for="m in milestones" 
          class="item-list-row">
          <CalendarIcon />
          <Tag v-if="m.resolved" 
            color="gray"
            class="w-[4.75rem]">Complete</Tag>
          <Tag v-else-if="m.id === currentMilestone.id"
            color="blue"
            class="w-[4.75rem]">Current</Tag>
          <Tag v-else 
            color="blue"
            class="w-[4.75rem]">Upcoming</Tag>
          <div class="flex-grow gray inline-html" v-html="m.title" />
          <!-- <div v-if="!m.resolved" class="tag">By {{ formatDate(m.dueDate) }}</div> -->
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
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { format } from 'v-money3'
import lodash_pkg from 'lodash';
const { filter, find, orderBy } = lodash_pkg;

const { makeBuyersphereLink } = useBuyersphereLinks()

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereMilestonesByIdCached } = storeToRefs(buyersphereStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [buyersphere, milestones, painPoints, features, { pricingTiers }, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereMilestonesByIdCached.value(buyersphereId),
  getPainPointsCached.value(buyersphereId),
  getFeaturesCached.value(buyersphereId),
  getPricingCached.value(buyersphereId),
  isUserLoggedIn.value(),
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
  if (hasUser) {
    myFeatures.value.interests[featureId] = answer
    await buyersphereStore.updateBuyerInput({ buyersphereId, featuresAnswer: myFeatures })
  }
}

async function updatePricingTierId (tierId) {
  if (hasUser) {
    await buyersphereStore.updateBuyerInput({ buyersphereId, pricingTierId: tierId })
  }
}

const successCriteria = ref(buyersphere.successCriteriaAnswer.text)
const objectives = ref(buyersphere.objectivesAnswer.text)
const keyConstraints = ref(buyersphere.constraintsAnswer.text)

async function updateSuccessCriteriaAnswer(text) {
  if (hasUser) {
    await buyersphereStore.updateBuyerInput({ 
      buyersphereId, 
      successCriteriaAnswer: { text }
    })
  }
}

async function updateObjectivesAnswer(text) {
  if (hasUser) {
    await buyersphereStore.updateBuyerInput({ 
      buyersphereId, 
      objectivesAnswer: { text }
    })
  }
}

async function updateConstraintsAnswer(text) {
  if (hasUser) {
    await buyersphereStore.updateBuyerInput({ 
      buyersphereId, 
      constraintsAnswer: { text }
    })
  }
}

// const milestones = computed(() => 
//   orderBy(
//     filter(conversations, c => c.collaborationType === 'milestone'),
//     ['dueDate'],
//     ['asc']
//   ))

const currentMilestone = computed(() => find(milestones, m => !m.resolved))

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
  @apply p-2 rounded-md border border-gray-border;

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
  @apply grid gap-y-1 gap-x-3 items-center;
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
