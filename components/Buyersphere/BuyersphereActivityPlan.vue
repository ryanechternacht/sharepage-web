<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup 
      :options="filterOptions"
      header="Assigned To"
      @update:option="updateFilter" />
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="h-full flex flex-row-reverse items-end">
      <NewButton @click="addActivity" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <NuxtLink class="page-link"
        :to="`/buyersphere/${buyersphereId}/discovery-guide`">Discovery Guide</NuxtLink>
      <h3 class="page-link">Activity Plan</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <!-- TODO grey these that are done -->
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
        <a v-if="completedItems.length" 
          class="in-page-link" 
          href="#completed">Completed</a>
      </div>
      <NuxtLink class="page-link"
        :to="`/buyersphere/${buyersphereId}/team`">Team</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/buyersphere/${buyersphereId}/assets`">Assets</NuxtLink>
      <NuxtLink v-if="isSeller"
        class="page-link"
        :to="`/buyersphere/${buyersphereId}/insights`">Insights</NuxtLink>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereActivityPlanSection v-if="overdueItems.length"
      id="overdue"
      :activities="overdueItems"
      overdue
      header="Overdue"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next7DaysItems.length"
      id="next-7-days"
      :activities="next7DaysItems"
      header="Next 7 Days"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next30DaysItems.length"
      id="next-30-days"
      :activities="next30DaysItems"
      header="Next 30 Days"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="next90DaysItems.length"
      id="next-90-days"
      :activities="next90DaysItems"
      header="Next 90 Days"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="beyondItems.length"
      id="beyond"
      :activities="beyondItems"
      header="Beyond"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />

    <BuyersphereActivityPlanSection v-if="completedItems.length"
      id="completed"
      :activities="completedItems"
      header="Completed"
      @update:activity="editActivity"
      @delete:activity="deleteActivity"
      @resolve:activity="resolveActivity" />


    <h2 class="estimated-finish">
      Est Finish: {{ lastItem.dueDate }}
    </h2>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, last, orderBy } = lodash_pkg;
import AddEditActivityItemModal from '@/components/Buyersphere/AddEditActivityItemModal.vue';
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyerspheresStore = useBuyerspheresStore()
const { getBuyersphereConversationsByIdCached } = storeToRefs(buyerspheresStore)

const usersStore = useUsersStore()
const { isUserSeller, getMeCached } = storeToRefs(usersStore)

const [conversations, me, isSeller] = await Promise.all([
  getBuyersphereConversationsByIdCached.value(buyersphereId),
  getMeCached.value(),
  isUserSeller.value(),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

const filterOptions = computed(() => [
  {text: 'Anyone', active: true},
  {text: 'Me', active: find(conversations, a => a.assignedTo?.id === me.id)},
  {text: 'Us', active: find(conversations, a => a.assignedTeam === me.team)},
  {text: 'Them', active: find(conversations, a => a.assignedTeam !== me.team)},
])
const currentFilter = ref('Anyone')

function updateFilter ({ option }) {
  currentFilter.value = option.text
}

const filteredActivities = computed(() => {
  if (currentFilter.value === 'Anyone') {
    return conversations
  } else if (currentFilter.value === 'Me') {
    return orderBy(
      filter(conversations, 
        a => a.assignedTo?.id === me.id),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Us') {
    return orderBy(
      filter(conversations, 
        a => a.assignedTeam === me.team),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Them') {
    return orderBy(
      filter(conversations, 
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
    filter(filteredActivities.value, 
      a => !a.resolved && dayjs(a.dueDate) < todayDayJs),
    ['dueDate'],
    ['asc']
  )
)

const next7DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => !a.resolved 
        && dayjs(a.dueDate) >= today
        && dayjs(a.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => !a.resolved 
        && dayjs(a.dueDate) >= next7Days
        && dayjs(a.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => !a.resolved 
        && dayjs(a.dueDate) >= next30Days
        && dayjs(a.dueDate) < next90Days),
    ['dueDate'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, 
      a => !a.resolved && dayjs(a.dueDate) >= next90Days),
    ['dueDate'],
    ['asc']
  )
)

const completedItems = computed(() =>
  orderBy(
    filter(filteredActivities.value, a => a.resolved),
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
  ) || {}
)

const { open, close, patchOptions } = useModal({
  component: AddEditActivityItemModal,
  attrs: {
    buyersphereId,
    onClose () {
      close ()
    }
  }
})

function addActivity() {
  patchOptions({ attrs: { activity: {} }})
  open()
}

function editActivity({ activity }) {
  patchOptions({ attrs: { activity }})
  open()
}

async function deleteActivity({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await buyerspheresStore.deleteConversation({ buyersphereId, conversationId: activity.id })
  }
}

async function resolveActivity({ activity, resolved }) {
  await buyerspheresStore.updateConversation({ 
    buyersphereId: buyersphereId,
    conversationId: activity.id,
    resolved: resolved,
  })
}
</script>

<style lang="postcss" scoped>
.estimated-finish {
  @apply mx-auto p-2 rounded-md bg-purple-background text-purple-secondary center-xy;

  /* midway - left sidebar - btn width - center left margin*/
  margin-left: calc(50vw - 220px - 6.5rem - .75rem);

  /* midway - btn width - center right margin*/
  margin-right: calc(50vw - 6.5rem - 3rem);
}
</style>
