<template>
  <div class="[grid-area:center] page-center" v-scroll-spy>
    <SwaypageInsightsSection 
      id="last-7-days"
      :items="last7DaysItems"
      header="Last 7 Days" />

    <SwaypageInsightsSection 
      id="last-30-days"
      :items="last30DaysItems"
      header="Last 30 Days" />

    <SwaypageInsightsSection 
      id="older"
      :items="olderItems"
      header="Older" />

    <div class="bottom-cover" />
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, map, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereBuyerActivityByIdCached } = storeToRefs(buyersphereStore)

const [buyerActivity] = await Promise.all([
  getBuyersphereBuyerActivityByIdCached.value(buyersphereId),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const last7Days = todayDayJs.subtract(7, 'day').toDate()
const last30Days = todayDayJs.subtract(30, 'day').toDate()

const allEvents = concat(
  map(buyerActivity.events, e => { e.sortDate = e.createdAt; return e }), 
  map(buyerActivity.activity, a => { a.sortDate = a.lastActivity; return a })
)

const last7DaysItems = computed(() => 
  orderBy(
    filter(allEvents, e => dayjs(e.sortDate) > last7Days),
    ['sortDate'],
    ['desc']
  )
)

const last30DaysItems = computed(() => 
  orderBy(
    filter(allEvents, 
      e => dayjs(e.sortDate) <= last7Days
        && dayjs(e.sortDate) > last30Days),
    ['sortDate'],
    ['desc']
  )
)

const olderItems = computed(() => 
  orderBy(
    filter(allEvents, e => dayjs(e.sortDate) <= last30Days),
    ['sortDate'],
    ['desc']
  )
)
</script>

<style lang="postcss" scoped>
</style>
