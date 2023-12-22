<template>
  <div class="[grid-area:left-header]">
    <!-- TODO share button -->
  </div>

  <div class="[grid-area:center-header]">
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/activity-plan`)">Activity Plan</div>
      <div class="page-link"
        @click="navigateTo(`/buyersphere/${buyersphereId}/team`)">Team</div>
      <h3 class="page-link">Insights</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 class="in-page-link"
          @click="navigateTo('#buyer-activity')">Buyer Activity</h4>
      </div>
    </div>
  </div>

  <div class="page-center" v-scroll-spy>
    <BuyersphereInsightsSection 
      :items="last7DaysItems"
      header="Last 7 Days" />

    <BuyersphereInsightsSection 
      :items="last30DaysItems"
      header="Last 30 Days" />

    <BuyersphereInsightsSection 
      :items="olderItems"
      header="Older" />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, last, orderBy } = lodash_pkg;

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
