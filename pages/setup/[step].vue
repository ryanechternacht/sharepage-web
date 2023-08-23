<template>
  <div>
    <div class="sticky">
      <div class="flex flex-row items-center p-8 h-12 justify-between">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img src="/logo.svg">
          <h3>Buyersphere</h3>
        </NuxtLink>
        <div class="flex flex-row items-center gap-x-2">
          <span>{{ user.name || user.email }}</span>
          👤
        </div>
      </div>
    </div>
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
          to="/setup/pricing-tiers" 
          class="step-box"
          :class="{'step-box-complete': hasPricingTiers}">
          Pricing Tiers
        </NuxtLink>
        <NuxtLink
          to="/setup/deal-timing" 
          class="step-box"
          :class="{'step-box-complete': hasDealTiming}">
          Deal Timing
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

    <div class="mx-8 mt-8">
      <SetupCompany v-if="step === 'company'"/>
      <SetupPersonas v-if="step === 'personas'"/>
      <SetupPainPoints v-if="step === 'pain-points'"/>
      <SetupFeatures v-if="step === 'features'"/>
      <SetupPricingTiers v-if="step === 'pricing-tiers'"/>
      <SetupDealTiming v-if="step === 'deal-timing'"/>
      <SetupUsers v-if="step === 'users'"/>
    </div>

  </div>
</template>

<script setup>
import { useUsersStore  } from '@/stores/users'
import { useOrganizationStore } from '@/stores/organization'
import { usePainPointsStore } from '@/stores/pain-points'
import { usePersonasStore } from '@/stores/personas'
import { useFeaturesStore } from '@/stores/features'
import { storeToRefs } from 'pinia'
import { usePricingTiersStore } from '@/stores/pricing-tiers'
import { useDealTimingStore } from '@/stores/deal-timing'

const route = useRoute()
const step = route.params.step

const usersStore = useUsersStore()
const { getMeCached, getUsersCached } = storeToRefs(usersStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const personasStore = usePersonasStore()
const { getPersonasCached } = storeToRefs(personasStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingTiersStore = usePricingTiersStore()
const { getPricingTiersCached } = storeToRefs(pricingTiersStore)

const dealTimingStore = useDealTimingStore()
const { getDealTimingCached } = storeToRefs(dealTimingStore)

const [user, organization, painPoints, personas, features, 
       pricingTiers, dealTiming, users] 
  = await Promise.all([
  getMeCached.value(),
  getOrganizationCached.value(),
  getPainPointsCached.value(),
  getPersonasCached.value(),
  getFeaturesCached.value(),
  getPricingTiersCached.value(),
  getDealTimingCached.value(),
  getUsersCached.value()
])

const hasCompany = false
const hasPersonas = personas.length
const hasPainPoints = painPoints.length
const hasFeatures = features.length
const hasPricingTiers = pricingTiers.length
const hasDealTiming = dealTiming.decisionDays
const hasUsers = users.length > 1
</script>

<style lang="postcss" scoped>
.step-box {
  @apply w-[6rem] h-[3.75rem] rounded-md bg-gray-lighter z-[1]
    flex flex-row items-center justify-center text-center p-1;
  @apply h3;
}

.step-box.step-box-complete {
  @apply bg-green-muted;
}

.step-box.router-link-active, .step-box.step-box-complete.router-link-active {
  @apply bg-purple-muted;
}
</style>