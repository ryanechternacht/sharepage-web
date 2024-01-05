<template>
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
      is-global-list
      overdue
      :activities="overdueItems"
      header="Overdue"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next7DaysItems.length"
      id="next-7-days"
      is-global-list
      :activities="next7DaysItems"
      header="Next 7 Days"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next30DaysItems.length"
      id="next-30-days"
      is-global-list
      :activities="next30DaysItems"
      header="Next 30 Days"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next90DaysItems.length"
      id="next-90-days"
      is-global-list
      :activities="next90DaysItems"
      header="Next 90 Days"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="beyondItems.length"
      id="beyond"
      is-global-list
      :activities="beyondItems"
      header="Beyond"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useActivitiesStore } from '@/stores/activities'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;


const activitiesStore = useActivitiesStore()
const { getActivitiesForOrganization } = storeToRefs(activitiesStore)

const [activities] = await Promise.all([
  getActivitiesForOrganization.value(),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

const overdueItems = computed(() =>
  orderBy(
    filter(activities, a => dayjs(a.dueDate) < todayDayJs),
    ['dueDate'],
    ['asc']
  )
)

const next7DaysItems = computed(() =>
  orderBy(
    filter(activities, 
      a => dayjs(a.dueDate) >= today
        && dayjs(a.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(activities, 
      a => dayjs(a.dueDate) >= next7Days
        && dayjs(a.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(activities, 
      a => dayjs(a.dueDate) >= next30Days
        && dayjs(a.dueDate) < next90Days),
    ['dueDate'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(activities, a => dayjs(a.dueDate) >= next90Days),
    ['dueDate'],
    ['asc']
  )
)

function goToActivity({ activity }) {
  navigateTo(`/buyersphere/${activity.buyersphereId}/activity-plan`)
}

function resolveActivity({ activity, resolved }) {
  activitiesStore.resolveActivity({ activity, resolved })
}
</script>

<style lang="postcss" scoped>
</style>
