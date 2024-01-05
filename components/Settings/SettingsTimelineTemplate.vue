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

  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton @click="createItem" />
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereActivityPlanSection v-if="next7DaysItems.length"
      id="next-7-days"
      is-template
      :activities="next7DaysItems"
      header="Next 7 Days"
      @update:activity="editActivityTemplate"
      @delete:activity="deleteActivityTemplate" />

    <BuyersphereActivityPlanSection v-if="next30DaysItems.length"
      id="next-30-days"
      is-template
      :activities="next30DaysItems"
      header="Next 30 Days"
      @update:activity="editActivityTemplate"
      @delete:activity="deleteActivityTemplate" />

    <BuyersphereActivityPlanSection v-if="next90DaysItems.length"
      id="next-90-days"
      is-template
      :activities="next90DaysItems"
      header="Next 90 Days"
      @update:activity="editActivityTemplate"
      @delete:activity="deleteActivityTemplate" />

    <BuyersphereActivityPlanSection v-if="beyondItems.length"
      id="beyond"
      is-template
      :activities="beyondItems"
      header="Beyond"
      @update:activity="editActivityTemplate"
      @delete:activity="deleteActivityTemplate" />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useActivityTemplateStore } from '@/stores/activity-template'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, last, orderBy } = lodash_pkg;
import AddEditActivityTemplateModal from '@/components/Settings/AddEditActivityTemplateModal.vue';
import { useModal } from 'vue-final-modal'

const activityTemplateStore = useActivityTemplateStore()
const { getActivityTemplateCached } = storeToRefs(activityTemplateStore)

const [items] = await Promise.all([
  getActivityTemplateCached.value(),
])

const next7DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => i.dueDateDays <= 7),
    ['dueDateDays'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => i.dueDateDays > 7
        && i.dueDateDays <= 30),
    ['dueDateDays'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(items, 
      i => i.dueDateDays > 30
        && i.dueDateDays <= 90),
    ['dueDateDays'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(items, i => i.dueDateDays > 90),
    ['dueDateDays'],
    ['asc']
  )
)

const { open, close, patchOptions } = useModal({
  component: AddEditActivityTemplateModal,
  attrs: {
    onClose () {
      close ()
    }
  }
})

function createItem() {
  patchOptions({ attrs: { activity: {} } })
  open()
}

function editActivityTemplate({ activity }) {
  patchOptions({ attrs: { activity }})
  open()
}

function deleteActivityTemplate({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    activityTemplateStore.deleteActivityTemplate({ id: activity.id })
  }
}

</script>

<style lang="postcss" scoped>

</style>