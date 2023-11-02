<template>
  <div>
    <div class="h-[50px]" /> <!-- vertical spacer while we're testing -->
    <div class="flex flex-row-reverse items-center w-[800px] mx-auto justify-between">
      <input
        class="w-[200px]"
        v-debounce:500ms="updateSearch"
        placeholder="Search Opportunity Name">

      <div class="login-box"
        :class="{'need-to-login': error}">
        <a href="http://stark.api.buyersphere-local.com/v0.1/auth/salesforce">
        Login to SF
      </a>
      </div>
    </div>
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
            color="teal"
            @click="createBuyersphere(oppty)">Create Buyershere</BsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'v-money3';
import { useModal } from 'vue-final-modal'
import AddBuyersphereModal from '@/components/AddBuyersphereModal'


const { featureFlags } = useAppConfig()
if (!featureFlags.salesforce) {
  await navigateTo('/')
}

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}
const search = ref('')

function updateSearch(val) {
  search.value = val
}


const query = computed(() => ({ name: search.value }))
const { apiFetch } = useNuxtApp()
const { data: opportunities, refresh, error } = await apiFetch('/v0.1/salesforce/opportunities', { 
  query
})

const { open: openModal, close: closeModal, patchOptions: patchModalOptions } = useModal({
  component: AddBuyersphereModal,
  attrs: {
    onClose () {
      closeModal()
      refresh()
    }
  }
})

function createBuyersphere(oppty) {
  patchModalOptions({ attrs: {
    dealAmount: oppty.amount,
    buyer: oppty.accountName,
    crmOpportunityId: oppty.id
  }})
  openModal()
}

</script>

<style lang="postcss" scoped>
.login-box {
  @apply border border-gray-light rounded-md p-1;

  &.need-to-login {
    @apply border-0 bg-teal-primary text-white;
  }
}

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
