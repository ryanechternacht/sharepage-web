<template>
  <div>
    <TopNav />
    <div class="flex flex-col items-center">
      <div class="flex flex-row items-center gap-x-[2.25rem] relative">
        <NuxtLink
          to="/setup/company" 
          class="step-box"
          :class="{'step-box-complete': hasCompany}">Company</NuxtLink>
        <NuxtLink
          to="/setup/personas" 
          class="step-box"
          :class="{'step-box-complete': hasPersonas}">
          Personas
        </NuxtLink>
        <NuxtLink
          to="/setup/pain-points" 
          class="step-box"
          :class="{'step-box-complete': hasPainPoints}">
          Pain Points
        </NuxtLink>
        <NuxtLink
          to="/setup/features" 
          class="step-box"
          :class="{'step-box-complete': hasFeatures}">
          Features
        </NuxtLink>
        <NuxtLink
          to="/setup/pricing" 
          class="step-box"
          :class="{'step-box-complete': hasPricing}">
          Pricing
        </NuxtLink>
        <NuxtLink
          to="/setup/deal-timing" 
          class="step-box"
          :class="{'step-box-complete': hasDealTiming}">
          Deal Timing
        </NuxtLink>
        <NuxtLink
          to="/setup/resources" 
          class="step-box"
          :class="{'step-box-complete': hasResources}">
          Resources
        </NuxtLink>
        <NuxtLink
          to="/setup/users" 
          class="step-box"
          :class="{'step-box-complete': hasUsers}">
          Users
        </NuxtLink>
        <div class="w-full border border-gray-dark absolute" />
      </div>
    </div>

    <div class="mx-8 mt-8 mb-40">
      <SetupCompany v-if="step === 'company'" />
      <SetupPersonas v-else-if="step === 'personas'" />
      <SetupPainPoints v-else-if="step === 'pain-points'" />
      <SetupFeatures v-else-if="step === 'features'" />
      <SetupPricing v-else-if="step === 'pricing'" />
      <SetupDealTiming v-else-if="step === 'deal-timing'" />
      <SetupResources v-else-if="step === 'resources'" />
      <SetupUsers v-else-if="step === 'users'" />
    </div>

  </div>
</template>

<script setup>
import { useUsersStore  } from '@/stores/users'
import { usePainPointsStore } from '@/stores/pain-points'
import { usePersonasStore } from '@/stores/personas'
import { useFeaturesStore } from '@/stores/features'
import { storeToRefs } from 'pinia'
import { usePricingStore } from '@/stores/pricing'
import { useDealTimingStore } from '@/stores/deal-timing'
import { useResourcesStore } from '~/stores/resources'

const route = useRoute()
const step = route.params.step

const usersStore = useUsersStore()
const { getMeCached, getUsersCached } = storeToRefs(usersStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const personasStore = usePersonasStore()
const { getPersonasCached } = storeToRefs(personasStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingTiersStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingTiersStore)

const dealTimingStore = useDealTimingStore()
const { getDealTimingCached } = storeToRefs(dealTimingStore)

const resourcesStore = useResourcesStore()
const { getResourcesCached } = storeToRefs(resourcesStore)

const [painPoints, personas, features, pricingTiers, dealTiming, 
       resources, users] 
  = await Promise.all([
    getPainPointsCached.value(),
    getPersonasCached.value(),
    getFeaturesCached.value(),
    getPricingCached.value(),
    getDealTimingCached.value(),
    getResourcesCached.value(),
    getUsersCached.value()
  ])

const hasCompany = false
const hasPersonas = personas.length
const hasPainPoints = painPoints.length
const hasFeatures = features.length
const hasPricing = pricingTiers.length
const hasDealTiming = dealTiming.decisionDays
const hasResources = resources.length
const hasUsers = users.length > 1
</script>

<style lang="postcss" scoped>
.step-box {
  @apply w-[6rem] h-[3.75rem] rounded-md bg-gray-lighter z-[1]
    center-xy text-center p-1;
  @apply h3;
}

.step-box.step-box-complete {
  @apply bg-green-background;
}

.step-box.router-link-active, .step-box.step-box-complete.router-link-active {
  @apply bg-purple-background;
}
</style>