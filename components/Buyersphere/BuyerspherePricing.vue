<template>
  <div class="flex flex-col items-center">
    <h3>We have budget for at least the lowest tier</h3>
    <div class="mt-3 flex flex-row gap-x-2">
      <Tag
        class="hover:cursor-pointer"
        :class="{'selected-can-pay': buyersphere.pricingCanPay === 'yes',
                 'not-selected-can-pay-selected-green': buyersphere.pricingCanPay && buyersphere.pricingCanPay !== 'yes'}"
        width="5.5rem"
        height="1.125rem"
        color="green"
        @click="updateCanPay('yes')">Yes</Tag>
      <Tag
        class="hover:cursor-pointer"
        :class="{'selected-can-pay': buyersphere.pricingCanPay === 'maybe',
                 'not-selected-can-pay-selected-orange': buyersphere.pricingCanPay && buyersphere.pricingCanPay !== 'maybe'}"
        width="5.5rem"
        height="1.125rem"
        color="orange"
        @click="updateCanPay('maybe')">Maybe</Tag>
      <Tag
        class="hover:cursor-pointer"
        :class="{'selected-can-pay': buyersphere.pricingCanPay === 'no',
                 'not-selected-can-pay-selected-red': buyersphere.pricingCanPay && buyersphere.pricingCanPay !== 'no'}"
        width="5.5rem"
        height="1.125rem"
        color="red"
        @click="updateCanPay('no')">No</Tag>
    </div>
    <div class="mt-6 flex flex-row gap-x-6 w-full px-[2.25rem]">
      <div v-for="pt in pricingTiers"
        class="flex flex-col justify-around justify-items-center bg-gray-lighter rounded-md flex-1 h-[100px] cursor-pointer p-1"
        :class="{'selected-pricing-tier': pt.id === buyersphere.pricingTierId}"
        @click="updatePricingTier(pt.id)">
        <h3 class="text-center">{{ pt.title }}</h3>
        <h3 v-if="pt.periodType === 'other'" class="text-center">
          {{ pt.amountOther }}
        </h3>
        <h3 v-else class="text-center">
          ${{ format(pt.amountPerPeriod, moneyConfig) }}/{{ periodMap[pt.periodType] }}
        </h3>
      </div>
    </div>
    <div class="mt-6 flex flex-col gap-y-3 w-full px-[2.25rem]">
      <div v-for="pt in pricingTiers">
        <h3>{{ pt.title }}: Best For {{ pt.bestFor }}</h3>
        <div class="gray inline-html" v-html="pt.description" />
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep } = lodash_pkg;
import { usePricingStore } from '@/stores/pricing'
import { storeToRefs } from 'pinia';
import { format } from 'v-money3';

const { buyersphere } = defineProps({ buyersphere: Object })
const emit = defineEmits(['update:can-pay', 'update:tier-id'])

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const { pricingTiers } = await getPricingCached.value()

const periodMap = {
  'annually': 'yr',
  'monthly': 'mo',
  'per-seat': 'seat'
}

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

function updateCanPay (canPay) {
  emit('update:can-pay', { canPay })
}

function updatePricingTier (tierId) {
  emit('update:tier-id', { tierId })
}
</script>

<style lang="postcss" scoped>
.selected-can-pay {
  @apply bg-teal-primary;

  :deep(.tag) {
    @apply text-white;
  }
}

.another-can-pay-selected {
  @apply bg-gray-lighter;
}

.not-selected-can-pay-selected-green {
  @apply bg-gray-lighter;

  &:hover {
    @apply bg-green-pastel;
  }
}

.not-selected-can-pay-selected-orange {
  @apply bg-gray-lighter;

  &:hover {
    @apply bg-orange-pastel;
  }
}

.not-selected-can-pay-selected-red {
  @apply bg-gray-lighter;

  &:hover {
    @apply bg-red-pastel;
  }
}


.selected-pricing-tier {
  @apply bg-teal-primary;

  h3 {
    @apply text-white;
  }
}
</style>