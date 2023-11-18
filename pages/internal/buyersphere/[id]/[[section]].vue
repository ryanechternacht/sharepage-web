<template>
  <div class="page-layout">
    <div class="page-top">top</div>
    <div class="page-left">
      <ul>
        <li>Introduction</li>
        <li>Personas</li>
        <li>Solution</li>
        <li>Features</li>
        <li>Pricing</li>
      </ul>
    </div>
    <div class="page-center">
      <div class="item-group">
        <div class="group-header bg-blue-pastel">
          <img src="/svg/hourglass-blue.svg">
          <span class="text-blue-bright">Active</span>
          <div class="p-1 px-2 bg-white rounded-md">{{ activeItemCount }}</div>
        </div>
        <template v-for="g in activeItemsGrouped">
          <div class="mx-auto tag gray-italic">{{ g.date }}</div>
          <InternalCollaborationItem
            v-for="i in g.items"
            :buyersphere-id="buyersphereId"
            :item="i" />
        </template>
      </div>
      <div class="item-group">
        <div class="group-header bg-yellow-pastel">
          <img src="/svg/clock-yellow.svg" class="">
          <span class="text-orange-jewel">Upcoming</span>
          <div class="p-1 px-2 bg-white rounded-md">{{ upcomingItemsCount }}</div>
        </div>
        <template v-for="g in upcomingItemsGrouped">
          <div class="mx-auto tag gray-italic">{{ g.date }}</div>
          <InternalCollaborationItem
            v-for="i in g.items"
            :buyersphere-id="buyersphereId"
            :item="i" />
        </template>
      </div>
      <div class="item-group">
        <div class="group-header bg-green-pastel">
          <img src="/svg/checkmark-green.svg" class="">
          <span class="text-teal-bright">Completed</span>
          <div class="p-1 px-2 bg-white rounded-md">{{ completedItemCount }}</div>
        </div>
        <template v-for="g in completedItemsGrouped">
          <div class="mx-auto tag gray-italic">{{ g.date }}</div>
          <InternalCollaborationItem
            v-for="i in g.items"
            :buyersphere-id="buyersphereId"
            :item="i" />
        </template>
      </div>
    </div>
    <div class="page-right">right</div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, find, groupBy, map, orderBy, reduce } = lodash_pkg;

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

const completedItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => c.resolved),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['desc']
  )
)

var nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

const activeItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => !c.resolved && new Date(c.dueDate) < nextWeek),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['asc']
  )
)

const upcomingItemsGrouped = computed(() => 
  orderBy(
    map(
      groupBy(
        filter(conversations, c => !c.resolved && new Date(c.dueDate) >= nextWeek),
        'dueDate'
      ),
      (v, k) => { return { date: k, items: v} }
    ),
    ['date'],
    ['asc']
  )
)

function getGroupCount(group) {
  return reduce(group, (acc, { items }) => acc + items.length, 0) || "-";
}

const completedItemCount = computed(() => getGroupCount(completedItemsGrouped.value))
const activeItemCount = computed(() => getGroupCount(activeItemsGrouped.value))
const upcomingItemsCount = computed(() => getGroupCount(upcomingItemsGrouped.value))

</script>

<style lang="postcss" scoped>
.page-layout {
  @apply grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas:
    "top  top    top"
    "left center right";
}

.page-top {
  grid-area: top;
}

.page-left {
  grid-area: left;
}

.page-center {
  @apply flex flex-col gap-6;
  grid-area: center;
}

.page-right {
  grid-area: right;
}

.item-group {
  @apply p-2 bg-gray-lightest border border-gray-lighter rounded-md
    flex flex-col gap-2 mt-4;
}

.group-header {
  @apply p-1 flex flex-row gap-2 items-center mx-auto rounded-md mt-[-1.5rem]
}
</style>
