<template>
  <div>
    <div class="h-[50px]" /> <!-- vertical spacer while we're testing -->
    <div class="flex flex-row items-center w-[800px] mx-auto">
      <div class="login-box"
        :class="{'need-to-login': error}">
        <a href="http://stark.api.buyersphere-local.com/v0.1/auth/salesforce">
          Login to SF
        </a>
      </div>

      <div class="flex-grow" />

      <div class="gray-italic">{{ pending ? "Loading" : "" }}</div>

      <div class="flex-grow" />

      <input id="onlyMine"
        type="checkbox"
        v-model="onlyMine">
      <label for="onlyMine" class="ml-2 h3">Only Mine?</label>
      <input
        class="w-[200px] ml-2"
        v-debounce:500ms="updateSearch"
        placeholder="Search Opportunity Name">
    </div>

    <div class="mx-auto w-[800px] flex flex-col gap-2">
      <div v-for="g in oppsGrouped"
        class="border border-gray-hover-active rounded-md p-4 border-l-[10px]">
        <div class="flex flex-row items-center gap-5 mb-3">
          <img :src="g.logo" class="w-[1.5rem] max-h-6">
          <h3 class="w-[15rem] truncate">{{ g.accountName }}</h3>
          <!-- TODO wrong owner? -->
          <Tag width="8.875rem" height="24px">{{ g.opportunities[0].ownerName }}</Tag>
        </div>

        <div class="flex flex-col gap-3">
          <div v-for="o in g.opportunities"
            class="flex flex-row ml-10 gap-4">
            <div>{{ o.buyersphereId ? "🪐" : "⭐️" }}</div>
            <div class="w-[15rem] truncate">{{ o.name }}</div>
            <Tag color="blue" width="5rem">{{ formatDate(o.closeDate) }}</Tag>
            <Tag color="teal" width="3rem">{{ format(o.amount / 1000, thousands) }}</Tag>
            <div class="ml-auto">
              <BsButton v-if="o.buyersphereId"
                class="w-[4.25rem]">View</BsButton>
              <BsButton v-else
                class="w-[4.25rem]">+ Create</BsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'v-money3';
import { useModal } from 'vue-final-modal'
import AddEditSwaypageModal from '@/components/AddEditSwaypageModal'
import lodash_pkg from 'lodash';
const { groupBy, map } = lodash_pkg;

definePageMeta({
  middleware: ['dead-page'],
})

const { featureFlags } = useAppConfig()
if (!featureFlags.salesforce) {
  await navigateTo('/')
}

const thousands = {
  precision: 0,
  prefix: '$',
  disableNegative: true,
  thousands: ',',
  suffix: 'k'
}

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D YYYY')
}

const search = ref('')

function updateSearch(val) {
  search.value = val
}

const onlyMine = ref(true)

const query = computed(() => {
  const val = { name: search.value } 
  if (onlyMine.value) {
    val['only-mine'] = true
  }
  return val
})
const { apiFetch } = useNuxtApp()
const { data: opportunities, refresh, error, pending } = await apiFetch('/v0.1/salesforce/opportunities', { 
  query,
})

const oppsGrouped = computed(() =>
  map(
    groupBy(
      opportunities.value, 
      'accountId'
    ),
    (v, k) => ({
      accountId: k,
      accountName: v[0].accountName,
      logo: v[0].logo,
      opportunities: v,
    })
  )
)

const { open: openModal, close: closeModal, patchOptions: patchModalOptions } = useModal({
  component: AddEditSwaypageModal,
  attrs: {
    onClose () {
      closeModal()
      refresh()
    }
  }
})

function createSwaypage(oppty) {
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
  @apply border border-gray-hover-active rounded-md p-1;

  &.need-to-login {
    @apply border-0 bg-green-primary text-white;
  }
}

.opportunities {
  @apply grid;
  grid-template-columns: 1fr 1fr auto auto 140px;

  .header-row {
    @apply contents;

    .header-cell {
      @apply border-b border-gray-hover-active font-bold p-2;
    }
  }

  .grid-row {
    @apply contents;

  .grid-cell {
    @apply p-2 flex flex-row items-center;
  }
    &:hover .grid-cell {
      @apply bg-gray-hover;

      .create-button {
        @apply block;
      }
    }
  }
}
</style>
