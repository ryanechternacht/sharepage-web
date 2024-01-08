<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/team`)">Team</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/assets`)">Assets</div>
      <h3 class="page-link">Insights</h3>
      <div v-scroll-spy-active v-scroll-spy-link
        class="mt-[-.75rem] mb-[.75rem]">
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
      header="Last 7 Days" />

    <BuyersphereInsightsSection 
      id="last-30-days"
      :items="last30DaysItems"
      header="Last 30 Days" />

    <BuyersphereInsightsSection 
      id="older"
      :items="olderItems"
      header="Older" />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereBuyerActivityByIdCached } = storeToRefs(buyersphereStore)

const [buyerActivity] = await Promise.all([
  getBuyersphereBuyerActivityByIdCached.value(buyersphereId),
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
