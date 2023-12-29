<template>
  <div class="[grid-area:left-header]">
  </div>

  <div class="[grid-area:center-header]">
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <h3 class="page-link">Activities</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 v-if="overdueItems.length" 
          @click="navigateTo('#overdue')"
          class="in-page-link">Overdue</h4>
        <h4 v-if="next7DaysItems.length" 
          @click="navigateTo('#next-7-days')"
          class="in-page-link">Next 7 Days</h4>
        <h4 v-if="next30DaysItems.length" 
          @click="navigateTo('#next-30-days')"
          class="in-page-link">Next 30 Days</h4>
        <h4 v-if="next90DaysItems.length" 
          @click="navigateTo('#next-90-days')"
          class="in-page-link">Next 90 Days</h4>
        <h4 v-if="beyondItems.length" 
          @click="navigateTo('#beyond')"
          class="in-page-link">Beyond</h4>
        <h4 v-if="completedItems.length" 
          @click="navigateTo('#completed')"
          class="in-page-link">Completed</h4>
      </div>
      <div class="page-link"
        @click="navigateTo(`/dashboard/accounts`)">Accounts</div>
      <div class="page-link"
        @click="navigateTo(`/dashboard/insights`)">Insights</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereActivityPlanSection v-if="overdueItems.length"
      id="overdue"
      :items="overdueItems"
      overdue
      header="Overdue"
      @update:item="editItem" />

    <BuyersphereActivityPlanSection v-if="next7DaysItems.length"
      id="next-7-days"
      :items="next7DaysItems"
      header="Next 7 Days"
      @update:item="editItem" />

    <BuyersphereActivityPlanSection v-if="next30DaysItems.length"
      id="next-30-days"
      :items="next30DaysItems"
      header="Next 30 Days"
      @update:item="editItem" />

    <BuyersphereActivityPlanSection v-if="next90DaysItems.length"
      id="next-90-days"
      :items="next90DaysItems"
      header="Next 90 Days"
      @update:item="editItem" />

    <BuyersphereActivityPlanSection v-if="beyondItems.length"
      id="beyond"
      :items="beyondItems"
      header="Beyond"
      @update:item="editItem" />

    <BuyersphereActivityPlanSection v-if="completedItems.length"
      id="completed"
      :items="completedItems"
      header="Completed"
      @update:item="editItem" />
      
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy } = lodash_pkg;


// TODO we'll need a route for "all" activities across deals
// not sure how we'll want to filter that yet...
const buyersphereId = 1

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const [buyersphere, conversations] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
])


const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

const overdueItems = computed(() =>
  orderBy(
    filter(conversations, c => !c.resolved && dayjs(c.dueDate) < todayDayJs),
    ['dueDate'],
    ['asc']
  )
)

const next7DaysItems = computed(() =>
  orderBy(
    filter(conversations, 
      c => !c.resolved 
        && dayjs(c.dueDate) >= today
        && dayjs(c.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(conversations, 
      c => !c.resolved 
        && dayjs(c.dueDate) >= next7Days
        && dayjs(c.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(conversations, 
      c => !c.resolved 
        && dayjs(c.dueDate) >= next30Days
        && dayjs(c.dueDate) < next90Days),
    ['dueDate'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(conversations, c => !c.resolved && dayjs(c.dueDate) >= next90Days),
    ['dueDate'],
    ['asc']
  )
)

const completedItems = computed(() =>
  orderBy(
    filter(conversations, c => c.resolved),
    ['dueDate'],
    ['asc']
  )
)

const lastItem = computed(() =>
  last(
    orderBy(
      filter(conversations, c => !c.resolved),
      ['dueDate'],
      ['asc']
    )
  )
)
</script>

<style lang="postcss" scoped>
</style>
