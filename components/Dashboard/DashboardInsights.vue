<template>
  <div class="[grid-area:left-header] left-header">
  </div>

  <div class="[grid-area:right-header] right-header">
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/dashboard/activities`)">Activities</div>
      <div class="page-link"
        @click="navigateTo(`/dashboard/accounts`)">Accounts</div>
      <h3 class="page-link">Insights</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 v-if="last7DaysItems.length" 
          @click="navigateTo('#last-7-days')"
          class="in-page-link">Last 7 Days</h4>
        <h4 v-if="last30DaysItems.length" 
          @click="navigateTo('#last-30-days')"
          class="in-page-link">Last 30 Days</h4>
        <h4 v-if="olderItems.length" 
          @click="navigateTo('#older')"
          class="in-page-link">Older</h4>
      </div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereInsightsSection
      id="last-7-days"
      :items="last7DaysItems"
      header="Last 7 Days"
      show-account />

    <BuyersphereInsightsSection
      id="last-30-days"
      :items="last30DaysItems"
      header="Last 30 Days" 
      show-account />

    <BuyersphereInsightsSection
      id="older"
      :items="olderItems"
      header="Older" 
      show-account />

    <div class="vertical-bar" />
  </div>
</template>
  
<script setup>
import { useBuyerActivityStore } from '@/stores/buyer-activity'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;

const buyerActivityStore = useBuyerActivityStore()
const { getBuyerActivityForOrganizationCached } = storeToRefs(buyerActivityStore)

const [buyerActivity] = await Promise.all([
  getBuyerActivityForOrganizationCached.value(),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const last7Days = todayDayJs.subtract(7, 'day').toDate()
const last30Days = todayDayJs.subtract(30, 'day').toDate()

const last7DaysItems = computed(() => 
  orderBy(
    filter(buyerActivity, ba => dayjs(ba.createdAt) > last7Days),
    ['createdAt'],
    ['asc']
  )
)

const last30DaysItems = computed(() => 
  orderBy(
    filter(buyerActivity, 
      ba => dayjs(ba.createdAt) <= last7Days
        && dayjs(ba.createdAt) > last30Days),
    ['createdAt'],
    ['asc']
  )
)

const olderItems = computed(() => 
  orderBy(
    filter(buyerActivity, ba => dayjs(ba.createdAt) <= last30Days),
    ['createdAt'],
    ['asc']
  )
)
</script>

<style lang="postcss" scoped>

</style>
