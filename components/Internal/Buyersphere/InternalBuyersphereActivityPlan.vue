<template>
  <div class="[grid-area:left-header]">
    <!-- TODO share button -->
  </div>

  <div class="[grid-area:center-header]">
  </div>

  <div class="[grid-area:left]">
    <div class="sticky top-[2rem] py-2 px-12">
      <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/discovery-guide`)">Discovery Guide</div>
        <h3 class="page-link">Activity Plan</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <!-- TODO grey these that are done -->
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
          @click="navigateTo('#next-90-Daysr')"
          class="in-page-link">Next 90 Days</h4>
        <h4 v-if="beyondItems.length" 
          @click="navigateTo('#beyond')"
          class="in-page-link">Beyond</h4>
        <h4 v-if="completedItems.length" 
          @click="navigateTo('#completed')"
          class="in-page-link">Completed</h4>
      </div>
      <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/team`)">Team</div>
      <!-- <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/assets`)">Assets</div>
      <div class="page-link"
        @click="navigateTo(`/internal/buyersphere/${buyersphereId}/notes`)">Notes</div> -->
    </div>
  </div>

  <div class="page-center mb-20" v-scroll-spy>
    <div v-if="overdueItems.length" 
      id="overdue"
      class="section">
      <div class="group-header">Overdue</div>
      <div class="item-list">
        <div v-for="item in overdueItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag text-red-secondary">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="next7DaysItems.length"
      id="next-7-days"
      class="section">
      <div class="group-header">Next 7 Days</div>
      <div class="item-list">
        <div v-for="item in next7DaysItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="next30DaysItems.length"
      id="next-30-days"
      class="section">
      <div class="group-header">Next 30 Days</div>
      <div class="item-list">
        <div v-for="item in next30DaysItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="next90DaysItems.length"
      id="next-90-days"
      class="section">
      <div class="group-header">Next 90 Days</div>
      <div class="item-list">
        <div v-for="item in next90DaysItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="beyondItems.length"
      id="beyond"
      class="section">
      <div class="group-header">Beyond</div>
      <div class="item-list">
        <div v-for="item in beyondItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="completedItems"
      id="completed"
      class="section">
      <div class="group-header">Completed</div>
      <div class="item-list">
        <div v-for="item in completedItems"
          class="item-list-row">
          <img src="/svg/checkmark.svg">
          <div class="inline-html" v-html="item.message" />
          <div class="flex-grow" />
          <div class="logos">
            <div class="tag">{{ prettyFormatDateFromToday(item.dueDate) }}</div>
            <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
            <Logo v-if="item.assignedTeam === 'buyer'"
                :src="buyersphere.buyerLogo" />
            <Logo v-else
              :src="organization.logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, conversations, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
])

const dayjs = useDayjs()

const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const today = todayDayJs.toDate()
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

function prettyFormatDateFromToday(date) {
  const d = dayjs(date)
  console.log(d)
  const daysApart = d.diff(todayDayJs, 'days')

  console.log(d, todayDayJs, daysApart)

  console.log(date, today, new Date(date), new Date(date) < today, d < todayDayJs)

  const dateFormat = 'MMM Do'

  if (daysApart < -7) {
    return d.format(dateFormat)
  } else if (daysApart < -1) {
    return `${-daysApart} days ago`
  } else if (daysApart === -1) {
    return "Yesterday"
  } else if (daysApart === 0) {
    return "Today"
  } else if (daysApart === 1) {
    return "Tomorrow"
  } else if (daysApart < 7) {
    return `in ${daysApart} days`
  } else {
    return d.format(dateFormat)
  }
}

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
</script>

<style lang="postcss" scoped>
.page-link {
  @apply mb-4 cursor-pointer;
}

.in-page-link {
  @apply py-2 pl-6 cursor-pointer rounded-md flex flex-row items-center;

  &.active {
    @apply bg-gray-hover pl-[.375rem];

    &::before {
      @apply h-[.875rem] mr-1;
      content: url('/svg/compass.svg');
    }
  }

  &.inactive {
    @apply text-gray-hover-active cursor-default;
  }
}

.page-center {
  @apply flex flex-col gap-20;
  grid-area: center;
}

.item-list {
  @apply mt-[2rem] flex flex-col gap-4;

  .item-list-row {
    @apply w-full flex flex-row items-center gap-2;

    &:hover {
      @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
      width: calc(100% + 2rem);
    }

    .logos {
      @apply w-[9.5rem] flex flex-row items-center gap-1 justify-end;
    }
  }
}
</style>
