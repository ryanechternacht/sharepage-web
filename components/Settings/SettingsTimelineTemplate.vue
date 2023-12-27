<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/settings/personal`)">Personal</div>
      <div class="page-link"
        @click="navigateTo(`/settings/guide-template`)">Guide Template</div>
      <h3 class="page-link">Timeline Template</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
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
        @click="navigateTo(`/settings/assets-template`)">Assets Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/admin`)">Admin</div>
    </div>
  </div>

  <div class="[grid-area:center]">
    {{ items }}

    <BuyersphereActivityPlanSection
      id="remove-me!"
      :items="items"
      header="All items"
      @update:item="editItem" />

    <!-- <BuyersphereActivityPlanSection v-if="next7DaysItems.length"
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
      @update:item="editItem" /> -->

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useActivityTemplateStore } from '@/stores/activity-template'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, last, orderBy } = lodash_pkg;
import EditCollaborationItemModal from '@/components/Buyersphere/EditCollaborationItemModal.vue';
import { useModal } from 'vue-final-modal'

const activityTemplateStore = useActivityTemplateStore()
const { getActivityTemplateCached } = storeToRefs(activityTemplateStore)

const [items] = await Promise.all([
  getActivityTemplateCached.value(),
])

const dayjs = useDayjs()
const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
const next7Days = todayDayJs.add(7, 'day').toDate()
const next30Days = todayDayJs.add(30, 'day').toDate()
const next90Days = todayDayJs.add(90, 'day').toDate()

const next7DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => dayjs(i.dueDate) < next7Days),
    ['dueDate'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => dayjs(i.dueDate) >= next7Days
        && dayjs(i.dueDate) < next30Days),
    ['dueDate'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => dayjs(i.dueDate) >= next30Days
        && dayjs(i.dueDate) < next90Days),
    ['dueDate'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(items, i => dayjs(i.dueDate) >= next90Days),
    ['dueDate'],
    ['asc']
  )
)

const { open, close, patchOptions } = useModal({
  component: EditCollaborationItemModal,
  attrs: {
    onClose () {
      close ()
    }
  }
})

function editItem({ item }) {
  // patchOptions({ attrs: { item }})
  open()
}

</script>

<style lang="postcss" scoped>

</style>