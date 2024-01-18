<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup 
      :options="filterOptions"
      header="Assigned To"
      @update:option="updateFilter" />
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <NuxtLink class="page-link"
        :to="`/settings/personal`">Personal</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/settings/guide-template`">Guide Template</NuxtLink>
      <h3 class="page-link">Timeline Template</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
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
        :to="`/settings/assets-template`">Assets Template</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/settings/admin`">Admin</NuxtLink>
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
const { filter, find, orderBy } = lodash_pkg;
import AddEditActivityTemplateModal from '@/components/Settings/AddEditActivityTemplateModal.vue';
import { useModal } from 'vue-final-modal'

const activityTemplateStore = useActivityTemplateStore()
const { getActivityTemplateCached } = storeToRefs(activityTemplateStore)

const [items] = await Promise.all([
  getActivityTemplateCached.value(),
])

const filterOptions = computed(() => [
  {text: 'Anyone', active: true},
  {text: 'Us', active: find(items, a => a.assignedTeam === 'seller')},
  {text: 'Them', active: find(items, a => a.assignedTeam === 'buyer')},
])
const currentFilter = ref('Anyone')

function updateFilter ({ option }) {
  currentFilter.value = option.text
}

const filteredItems = computed(() => {
  if (currentFilter.value === 'Anyone') {
    return items
  } else if (currentFilter.value === 'Us') {
    return orderBy(
      filter(items, 
        a => a.assignedTeam === 'seller'),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Them') {
    return orderBy(
      filter(items, 
        a => a.assignedTeam === 'buyer'),
      ['dueDate'],
      ['asc']
    )
  } else {
    return []
  }
})

const next7DaysItems = computed(() =>
  orderBy(
    filter(filteredItems.value, 
      i => i.dueDateDays <= 7),
    ['dueDateDays'],
    ['asc']
  )
)

const next30DaysItems = computed(() =>
  orderBy(
    filter(filteredItems.value, 
      i => i.dueDateDays > 7
        && i.dueDateDays <= 30),
    ['dueDateDays'],
    ['asc']
  )
)

const next90DaysItems = computed(() =>
  orderBy(
    filter(filteredItems.value, 
      i => i.dueDateDays > 30
        && i.dueDateDays <= 90),
    ['dueDateDays'],
    ['asc']
  )
)

const beyondItems = computed(() =>
  orderBy(
    filter(filteredItems.value, i => i.dueDateDays > 90),
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

async function deleteActivityTemplate({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await activityTemplateStore.deleteActivityTemplateItem({ id: activity.id })
  }
}

</script>

<style lang="postcss" scoped>

</style>