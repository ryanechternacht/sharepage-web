<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup 
      :options="filterOptions"
      header="Assigned To"
      @update:option="updateFilter" />
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="h-full flex flex-row-reverse items-end">
      <NewButton @click="open" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <h3 class="page-link">Activities</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <a v-if="overdueItems.length" 
          class="in-page-link" 
          href="#overdue">Overdue</a>
        <a v-if="next7DaysItems.length" 
          class="in-page-link" 
          href="#next-7-days">Next 7 Days</a>
        <a v-if="next30DaysItems.length" 
          class="in-page-link" 
          href="#next-30-days">Next 30 Days</a>
        <a v-if="next90DaysItems.length" 
          class="in-page-link" 
          href="#next-90-days">Next 90 Days</a>
        <a v-if="beyondItems.length" 
          class="in-page-link" 
          href="#beyond">Beyond</a>
      </div>
      <NuxtLink class="page-link"
        :to="`/dashboard/accounts`">Accounts</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/dashboard/insights`">Insights</NuxtLink>
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
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy } = lodash_pkg;
import AddEditActivityItemModalOld from '@/components/Buyersphere/AddEditActivityItemModalOld.vue';
import { useModal } from 'vue-final-modal'

const { makeBuyersphereLink } = useBuyersphereLinks()

const activitiesStore = useActivitiesStore()
const { getActivitiesForOrganization } = storeToRefs(activitiesStore)

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [activities, me] = await Promise.all([
  getActivitiesForOrganization.value(),
  getMeCached.value(),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

const filterOptions = computed(() => [
  {text: 'Anyone', active: true},
  {text: 'Me', active: find(activities, a => a.assignedTo?.id === me.id)},
  {text: 'Us', active: find(activities, a => a.assignedTeam === me.team)},
  {text: 'Them', active: find(activities, a => a.assignedTeam !== me.team)},
])
const currentFilter = ref('Anyone')

function updateFilter ({ option }) {
  currentFilter.value = option.text
}

const filteredActivities = computed(() => {
  if (currentFilter.value === 'Anyone') {
    return activities
  } else if (currentFilter.value === 'Me') {
    return orderBy(
      filter(activities, 
        a => a.assignedTo?.id === me.id),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Us') {
    return orderBy(
      filter(activities, 
        a => a.assignedTeam === me.team),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Them') {
    return orderBy(
      filter(activities, 
        a => a.assignedTeam !== me.team),
      ['dueDate'],
      ['asc']
    )
  } else {
    return []
  }
})

const overdueItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, a => dayjs(a.dueDate) < todayDayJs),
    ['dueDate'],
    ['asc']
  )
)

const next7DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => dayjs(a.dueDate) >= today
        && dayjs(a.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => dayjs(a.dueDate) >= next7Days
        && dayjs(a.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => dayjs(a.dueDate) >= next30Days
        && dayjs(a.dueDate) < next90Days),
    ['dueDate'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, a => dayjs(a.dueDate) >= next90Days),
    ['dueDate'],
    ['asc']
  )
)

function goToActivity({ activity }) {
  // TODO this is a bit of a hack :/
  navigateTo(makeBuyersphereLink({ 
    id: activity.buyersphereId, 
    buyer: activity.buyer.name,
  }, 'activity-plan'))
}

async function resolveActivity({ activity, resolved }) {
  await activitiesStore.resolveActivity({ activity, resolved })
}

const { open, close } = useModal({
  component: AddEditActivityItemModalOld,
  attrs: {
    onClose () {
      close ()
    }
  }
})
</script>

<style lang="postcss" scoped>
</style>
