<template>
  <div class="page-left">
    <div class="sticky top-[2rem] p-2 flex flex-col gap-1 bg-gray-lightest border border-gray-lighter rounded-md"
      v-scroll-spy-active
      v-scroll-spy-link>

      <!-- The nested div is so scrollspy works correclty with the hrs -->
      <div>
        <div @click="navigateTo('#introduction')"
          class="page-link">👋 &nbsp; Introduction</div>
      </div>
      <div>
        <hr>
        <div @click="navigateTo('#decision-criteria')"
        class="page-link">💊 &nbsp; Decision Criteria</div>
      </div>
      <div>
        <div @click="navigateTo('#solution-scope')"
          class="page-link">🎯 &nbsp; Solution Scope</div>
      </div>
      <div>
        <div @click="navigateTo('#constraints')"
          class="page-link">🧩 &nbsp; Constraints</div>
      </div>
      <div>
        <div @click="navigateTo('#notes')"
          class="page-link">📒 &nbsp; Notes</div>
      </div>
      <div>
        <div @click="navigateTo('#resources')"
          class="page-link">📓 &nbsp; Resources</div>
      </div>
    </div>
  </div>
  
  <div class="page-center mb-20" v-scroll-spy>
    <div id="introduction"
      class="item-group" 
    >
      <div class="group-header">👋 &nbsp; Introduction</div>
      <div class="section">
        <h3>🦄 A Message from Mave at Johnson & Johnson</h3>
        <div class="inline-html bg-white" v-html="buyersphere.introMessage" />
      </div>
    </div>
    <div id="decision-criteria"
      class="item-group" 
    >
      <div class="group-header">💊 &nbsp; Decision Criteria</div>
      <div class="gray-italic">Describe the pain points you're looking to resolve</div>
      <TipTapTextarea v-model="problemToSolve"
        placeholder="Pain points to resolve"
        class="w-full mb-4" />

      <div class="gray-italic mb-1">The big problems we solve</div>
      <div class="items-list">
        <template v-for="pp in painPoints"
          class="items-list-row">
          <div class="flex flex-">
            <Tag2 color="blue" class="mx-auto">{{ pp.title }}</Tag2>
          </div>
          <div class="inline-html" v-html="pp.description" />
        </template>
      </div>
    </div>
    
    <div id="solution-scope"
      class="item-group" 
    >
      <div class="group-header">🎯 &nbsp; Solution Scope</div>
      <div class="gray-italic">What are your goals?</div>
      <TipTapTextarea v-model="problemToSolve"
        placeholder="Pain points to resolve"
        class="w-full mb-4" />

      <div class="gray-italic mb-1">Let us know what features are important to you</div>
      <div class="flex flex-col gap-4">
        <div v-for="(f, i) in features" 
          class="four-tile-grid">
          <Tag2 color="blue" class="mx-auto">Feature #{{ i + 1 }}</Tag2>
          <h3>{{ f.title }}</h3>
          <div class="justify-center">
            <PButton
              variant="gray"
              size="medium"
              :selected="myFeatures?.interests[f.id] === 'yes'"
              @click="saveFeatureInterest(f.id, 'yes')">✅</PButton>
            <PButton
              variant="gray"
              size="medium"
              :selected="myFeatures?.interests[f.id] === 'maybe'"
              @click="saveFeatureInterest(f.id, 'maybe')">🚧</PButton>
            <PButton
              variant="gray"
              size="medium"
              :selected="myFeatures?.interests[f.id] === 'no'"
              @click="saveFeatureInterest(f.id, 'no')">⛔</PButton>
          </div>
          <div class="gray inline-html" v-html="f.description" />
        </div>
      </div>
    </div>
   
    <div id="constraints"
      class="item-group" 
    >
      <div class="group-header">🧩 &nbsp; Constraints</div>
      <div class="gray-italic">What are your constraints?</div>
      <TipTapTextarea v-model="problemToSolve"
        placeholder="Key constraints to buying"
        class="w-full mb-4" />

      <div class="gray-italic mb-1">Which pricing model best fits your needs?</div>
      <div class="flex flex-col gap-4 mb-4">
        <div v-for="pt in pricingTiers" 
          class="pricing-tier"
          :class="{'selected-pricing-tier': pt.id === buyersphere.pricingTierId}"
          @click="updatePricingTierId(pt.id)">
          <Tag2 :color="pt.id === buyersphere.pricingTierId ? 'dark-blue': 'blue'" 
            class="mx-auto">{{ pt.title }}</Tag2>
          <h3>Best for {{ pt.bestFor }}</h3>
          <h3 class="mx-auto">
            {{ pt.periodType === 'other'
              ? pt.amountOther
              : `$${format(pt.amountPerPeriod, moneyConfig)}/${periodMap[pt.periodType]}` }}
          </h3>
          <div class="gray inline-html" v-html="pt.description" />
        </div>
      </div>
      <div class="gray-italic">What other tools are you using / want to keep using?</div>
      <TipTapTextarea v-model="problemToSolve"
        placeholder="Other tools we need to be aware of"
        class="w-full" />
    </div>
    
    <div id="notes"
      class="item-group" 
    >
      <div class="group-header">📒 &nbsp; Notes</div>

      <div class="document-list">
        <template v-for="n in buyersphere.notes"
          class="items-list-row">
          <div>📒</div>
          <div>{{ n.title }}</div>
          <div class="flex flex-row items-center gap-2 justify-end">
            <div class="gray-italic">{{ formatDate(n.createdAt) }}</div>
            <UserAvatar :user="n.author" />
          </div>
        </template>
      </div>
    </div>
   
    <div id="resources"
      class="item-group" 
    >
      <div class="group-header">📓 &nbsp; Resources</div>
      <div class="document-list">
        <template v-for="r in resources"
          class="items-list-row">
          <div>📓</div>
          <div>{{ r.title }}</div>
          <div class="gray-italic text-right">{{ formatDate(r.createdAt) }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { usePainPointsStore } from '@/stores/pain-points'
import { useFeaturesStore } from '@/stores/features'
import { useResourcesStore } from '@/stores/resources'
import { usePricingStore } from '@/stores/pricing'
import { storeToRefs } from 'pinia'
import { format } from 'v-money3';

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const resourcesStore = useResourcesStore()
const { getResourcesCached } = storeToRefs(resourcesStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const [buyersphere, painPoints, features, resources, { pricingTiers }] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getPainPointsCached.value(),
  getFeaturesCached.value(),
  getResourcesCached.value(),
  getPricingCached.value(),
])

const periodMap = {
  'annually': 'yr',
  'monthly': 'mo',
  'per-seat': 'user'
}

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMMM Do')
}

// is this worth doing for snappier UX? (probably)
const myFeatures = ref(buyersphere.featuresAnswer)

function saveFeatureInterest (featureId, answer) {
  myFeatures.value.interests[featureId] = answer
  buyersphereStore.saveFeaturesAnswer({ buyersphereId, featuresAnswer: myFeatures })
}

function updatePricingTierId (tierId) {
  buyersphereStore.savePricingTierId({ buyersphereId, pricingTierId: tierId })
}

// function makeInternalBuyersphereLink(section) {
//   return section === 'map'
//     ? `/internal/buyersphere/${route.params.id}`
//     : `/internal/buyersphere/${route.params.id}/${section}`
// }
</script>

<style lang="postcss" scoped>
.page-left {
  @apply px-6;
  grid-area: left;
}

hr {
    @apply text-gray-lighter mt-1;
  }

.page-center {
  @apply flex flex-col gap-20;
  grid-area: center;
}

.page-link {
  @apply py-1 cursor-pointer;

  &:hover {
    @apply bg-gray-lighter rounded-md;
  }
}

.active .page-link {
  @apply bg-teal-primary rounded-md mx-[-.5rem] px-2 text-white;
}

.item-group {
  @apply p-8 bg-gray-lightest border border-gray-lighter rounded-md
    flex flex-col mt-4;
}

.group-header {
  @apply p-2 flex flex-row gap-2 items-center mx-auto rounded-md 
    mt-[-2.875rem] /*-46px*/ mb-5 bg-white border border-gray-lighter;
}

.section {
  @apply p-4 bg-white border border-gray-lighter;

  h3 {
    @apply mb-1;
  }
}

.items-list {
  @apply grid gap-y-2;
  grid-template-columns: auto 1fr;

  > * {
    @apply px-3 py-2 bg-white border-gray-lighter border-y;
  }

  > *:nth-child(2n + 1) {
    @apply rounded-l-md border-l;
  }

  > *:nth-child(2n + 2) {
    @apply rounded-r-md border-r;
  }
}

.document-list {
  @apply grid gap-y-2 items-center;
  grid-template-columns: auto 1fr 150px;

  > * {
    @apply px-3 py-2 bg-white border-gray-lighter border-y;
  }

  > *:nth-child(3n + 1) {
    @apply rounded-l-md border-l;
  }

  > *:nth-child(3n + 3) {
    @apply rounded-r-md border-r;
  }
}

.four-tile-grid {
  @apply px-6 py-4 bg-white border border-gray-lighter grid items-center gap-x-3 gap-y-1;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}

.pricing-tier {
  @apply four-tile-grid;
  @apply hover:bg-gray-lightest cursor-pointer;

  &.selected-pricing-tier {
    @apply bg-blue-background;
  }
}
</style>
