<template>
  <div>
    <div class="opportunities mx-auto w-[800px]">
      <div class="header-row">
        <div class="header-cell">Account Name</div>
        <div class="header-cell">Opportunity Name</div>
        <div class="header-cell">Amount</div>
        <div class="header-cell"></div>
      </div>
      <div v-for="oppty in opportunities"
        class="grid-row">
        <div class="grid-cell">
          <div class="flex flex-col items-start">
            <div class="font-bold">{{ oppty.accountName }}</div>
            <div class="tag gray-italic">{{ oppty.accountId }}</div>
          </div>
        </div>
        <div class="grid-cell">
          <div class="flex flex-col items-start">
            <div class="font-bold">{{ oppty.name }}</div>
            <div class="tag gray-italic">{{ oppty.id }}</div>
          </div>
        </div>
        <div class="grid-cell">
          <div class="font-bold">${{ format(oppty.amount, moneyConfig) }}</div>
        </div>
        <div class="grid-cell">
          <NuxtLink v-if="oppty.buyersphereId" 
            :to="`/buyersphere/${oppty.buyersphereId}`"
            class="italic underline text-teal-primary">
            Go To Buyersphere
          </NuxtLink>
          <BsButton v-else class="hidden create-button"
            color="teal">Create Buyershere</BsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'v-money3';

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const query = {}
const { apiFetch } = useNuxtApp()
const { data: opportunities, refresh } = await apiFetch('/v0.1/salesforce/opportunities', { 
  query
})

</script>

<style lang="postcss" scoped>
.opportunities {
  @apply grid;
  grid-template-columns: 1fr 1fr auto 140px;

  .header-row {
    @apply contents;

    .header-cell {
      @apply border-b border-gray-light font-bold p-2;
    }
  }

  .grid-row {
    @apply contents;

  .grid-cell {
    @apply p-2 flex flex-row items-center;
  }
    &:hover .grid-cell {
      @apply bg-gray-lighter;

      .create-button {
        @apply block;
      }
    }
  }
}
</style>
