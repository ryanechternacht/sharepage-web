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
    </div>
  </div>

  <div class="page-center mb-20" v-scroll-spy>
    <InternalBuyersphereActivityPlanSection v-if="overdueItems.length"
      id="overdue"
      :items="overdueItems"
      overdue
      header="Overdue"
      @update:item="editItem" />

    <InternalBuyersphereActivityPlanSection v-if="next7DaysItems.length"
      id="next-7-days"
      :items="next7DaysItems"
      header="Next 7 Days"
      @update:item="editItem" />

    <InternalBuyersphereActivityPlanSection v-if="next30DaysItems.length"
      id="next-30-days"
      :items="next30DaysItems"
      header="Next 30 Days"
      @update:item="editItem" />

    <InternalBuyersphereActivityPlanSection v-if="next90DaysItems.length"
      id="next-90-days"
      :items="next90DaysItems"
      header="Next 90 Days"
      @update:item="editItem" />

    <InternalBuyersphereActivityPlanSection v-if="beyondItems.length"
      id="beyond"
      :items="beyondItems"
      header="Beyond"
      @update:item="editItem" />

    <InternalBuyersphereActivityPlanSection v-if="completedItems.length"
      id="completed"
      :items="completedItems"
      header="Completed"
      @update:item="editItem" />


    <h2 class="mx-auto p-2 rounded-md bg-purple-background text-purple-secondary">
      Est Finish: {{ lastItem.dueDate }}
    </h2>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, last, orderBy } = lodash_pkg;
import EditCollaborationItemModal from '@/components/Buyersphere/EditCollaborationItemModal.vue';
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const [conversations] = await Promise.all([
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

const { open: openEditModal, close: closeEditModal, patchOptions: patchModalOptions, options } = useModal({
  component: EditCollaborationItemModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeEditModal ()
    }
  }
})

function editItem({ item }) {
  patchModalOptions({ attrs: { item }})
  openEditModal()
}
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
</style>
