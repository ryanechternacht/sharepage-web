<template>
  <div class="flex flex-col gap-6">
    <div class="item-group">
      <div class="group-header bg-blue-primary">
        <img src="/svg/hourglass-blue.svg">
        <span class="text-blue-primary">Active</span>
        <div class="white-box">{{ activeItemCount }}</div>
      </div>
      <template v-for="g in activeItemsGrouped">
        <div class="mx-auto tag gray-italic">{{ g.date }}</div>
        <InternalBuyersphereMutualActionPlanItem
          v-for="i in g.items"
          :buyersphere-id="buyersphereId"
          :item="i"
          :resolved-state-when-clicked="true"
          @edit-item="editItem(i)" />
      </template>
    </div>
    <div class="item-group">
      <div class="group-header">
        <img src="/svg/clock-yellow.svg" class="">
        <span class="text-orange-secondary">Upcoming</span>
        <div class="white-box">{{ upcomingItemsCount }}</div>
      </div>
      <template v-for="g in upcomingItemsGrouped">
        <div class="mx-auto tag gray-italic">{{ g.date }}</div>
        <InternalBuyersphereMutualActionPlanItem
          v-for="i in g.items"
          :buyersphere-id="buyersphereId"
          :item="i"
          :resolved-state-when-clicked="true"
          @edit-item="editItem(i)" />
      </template>
    </div>
    <div class="item-group">
      <div class="group-header bg-green-background">
        <img src="/svg/checkmark-green.svg" class="">
        <span class="text-green-primary">Completed</span>
        <div class="white-box">{{ completedItemCount }}</div>
      </div>
      <template v-for="g in completedItemsGrouped">
        <div class="mx-auto tag gray-italic">{{ g.date }}</div>
        <InternalBuyersphereMutualActionPlanItem
          v-for="i in g.items"
          :buyersphere-id="buyersphereId"
          :item="i"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(i)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, groupBy, map, orderBy, reduce } = lodash_pkg;
import EditCollaborationItemModal from '@/components/Buyersphere/EditCollaborationItemModal.vue';
import { useModal } from 'vue-final-modal'

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

const { open: openEditModal, close: closeEditModal, patchOptions: patchModalOptions, options } = useModal({
  component: EditCollaborationItemModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeEditModal ()
    }
  }
})

function editItem(item) {
  patchModalOptions({ attrs: { item }})
  openEditModal()
}
</script>

<style scoped lang="postcss">
.item-group {
  @apply p-2 bg-cream-background border border-cream-highlight rounded-md
    flex flex-col gap-2 mt-4;
}

.group-header {
  @apply px-2 py-1 flex flex-row gap-2 items-center mx-auto rounded-md mt-[-1.5rem]
}

.white-box {
  @apply p-1 px-2 bg-white rounded-md text-gray-subtext;
}
</style>