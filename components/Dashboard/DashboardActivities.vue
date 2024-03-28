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
        <a v-if="overdueActivities.length" 
          class="in-page-link" 
          href="#overdue">Overdue</a>
        <a v-if="next7DaysActivities.length" 
          class="in-page-link" 
          href="#next-7-days">Next 7 Days</a>
        <a v-if="next30DaysActivities.length" 
          class="in-page-link" 
          href="#next-30-days">Next 30 Days</a>
      </div>
      <NuxtLink class="page-link"
        :to="`/dashboard/accounts`">Accounts</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/dashboard/insights`">Insights</NuxtLink>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <SwaypageActivityPlanSection
      v-if="overdueActivities.length"
      :activities="overdueActivities"
      is-global-list
      header="Overdue"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <SwaypageActivityPlanSection
      v-if="next7DaysActivities.length"
      :activities="next7DaysActivities"
      is-global-list
      header="Next 7 Days"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <SwaypageActivityPlanSection
      v-if="next30DaysActivities.length"
      :activities="next30DaysActivities"
      is-global-list
      header="Next 30 Days"
      @click:activity="goToActivity"
      @resolve:activity="resolveActivity" />

    <div class="bottom-cover" />
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useActivitiesStore } from '@/stores/activities'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy } = lodash_pkg;
import AddEditActivityItemModal from '@/components/Buyersphere/AddEditActivityItemModal.vue';
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

const overdueActivities = computed(() =>
  orderBy(
    filter(filteredActivities.value, a => dayjs(a.dueDate) < todayDayJs),
    ['dueDate'],
    ['asc']
  )
)

const next7DaysActivities = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => dayjs(a.dueDate) >= today
        && dayjs(a.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysActivities = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => dayjs(a.dueDate) >= next7Days
        && dayjs(a.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

function goToActivity({ activity }) {
  navigateTo(makeBuyersphereLink({ 
    id: activity.buyersphereId, 
    buyer: activity.buyer.name,
  }, 'activity-plan'))
}

async function resolveActivity({ activity, resolved }) {
  await activitiesStore.resolveActivity({ activity, resolved })
}

const { open, close } = useModal({
  component: AddEditActivityItemModal,
  attrs: {
    onClose () {
      close ()
    },
    onActivityCreated ({ activity, milestoneId, buyersphereId }) {
      activitiesStore.createActivity({
        buyersphereId,
        milestoneId,
        activity
      })
    },
  }
})
</script>

<style lang="postcss" scoped>
</style>
