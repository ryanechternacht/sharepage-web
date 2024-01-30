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
        <template v-for="mt in groups">
          <a v-if="mt.activityTemplates.length" 
            class="in-page-link" 
            :href="`#${mt.title}`">{{ mt.title }}</a>
        </template>
      </div>
      <NuxtLink class="page-link"
        :to="`/settings/assets-template`">Assets Template</NuxtLink>
      <NuxtLink class="page-link"
        :to="`/settings/admin`">Admin</NuxtLink>
    </div>
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="flex flex-row-reverse items-center">
      <NewButton @click="addMilestoneTemplate"
        text="New Milestone" />
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereActivityPlanSection
      v-for="milestoneTemplate in groups"
      :id="milestoneTemplate.title"
      :milestone="milestoneTemplate"
      :activities="milestoneTemplate.activityTemplates"
      is-template
      @update:milestone="editMilestoneTemplate"
      @delete:milestone="deleteMilestoneTemplate"
      @create:activity="addActivityTemplate"
      @update:activity="editActivityTemplate"
      @delete:activity="deleteActivityTemplate"
    />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useTemplatesStore } from '@/stores/templates'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, map, orderBy } = lodash_pkg;
import AddEditActivityItemModal from '@/components/Buyersphere/AddEditActivityItemModal';
import AddEditActivityMilestoneModal from '@/components/Buyersphere/AddEditActivityMilestoneModal';
import { useModal } from 'vue-final-modal'

const templatesStore = useTemplatesStore()
const { getMilestoneTemplatesCached, getActivityTemplatesCached } = storeToRefs(templatesStore)

const [milestoneTemplates, activityTemplates] = await Promise.all([
  getMilestoneTemplatesCached.value(),
  getActivityTemplatesCached.value(),
])

const filterOptions = computed(() => [
  {text: 'Anyone', active: true},
  {text: 'Us', active: find(activityTemplates, a => a.assignedTeam === 'seller')},
  {text: 'Them', active: find(activityTemplates, a => a.assignedTeam === 'buyer')},
])
const currentFilter = ref('Anyone')

function updateFilter ({ option }) {
  currentFilter.value = option.text
}

const filteredActivityTemplates = computed(() => {
  if (currentFilter.value === 'Anyone') {
    return activityTemplates
  } else if (currentFilter.value === 'Us') {
    return orderBy(
      filter(activityTemplates, 
        a => a.assignedTeam === 'seller'),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Them') {
    return orderBy(
      filter(activityTemplates, 
        a => a.assignedTeam === 'buyer'),
      ['dueDate'],
      ['asc']
    )
  } else {
    return []
  }
})

const groups = computed(() =>
  orderBy(
    map(milestoneTemplates, (mt) => {
      mt.activityTemplates = []
      mt.activityTemplates = filter(filteredActivityTemplates.value,
        (at) => at.milestoneTemplateId === mt.id)
      return mt
    }),
  ['ordering'],
  ['asc'])
)

const {
  open: openActivityModal,
  close: closeActivityModal,
  patchOptions: patchActivityModal
} = useModal({
  component: AddEditActivityItemModal,
  attrs: {
    isTemplate: true,
    onClose () {
      closeActivityModal ()
    },
    onActivityCreated ({ activity, milestoneId }) {
      templatesStore.createActivityTemplate({
        milestoneTemplateId: milestoneId,
        activityTemplate: activity
      })
    },
    onActivityEdited ({ activity }) {
      activity.milestoneTemplateId = activity.milestoneId
      templatesStore.updateActivityTemplate({
        id: activity.id,
        activityTemplate: activity
      })
    },
  }
})

function addActivityTemplate({ milestoneId }) {
  patchActivityModal({ attrs: { activity: {}, milestoneId }})
  openActivityModal()
}

function editActivityTemplate({ activity }) {
  patchActivityModal({ attrs: { activity, milestoneId: activity.milestoneTemplateId }})
  openActivityModal()
}

async function deleteActivityTemplate({ activity }) {
  const c = confirm('Are you sure you want to delete this action item template')

  if (c) {
    await templatesStore.deleteActivityTemplate({ id: activity.id })
  }
}

const {
  open: openMilestoneTemplateModal,
  close: closeMilestoneTemplateModal,
  patchOptions: patchMilestoneTemplateModal
} = useModal({
  component: AddEditActivityMilestoneModal,
  attrs: {
    isTemplate: true,
    onClose () {
      closeMilestoneTemplateModal ()
    },
    onMilestoneCreated ({ milestone }) {
      templatesStore.createMilestoneTemplate({
        milestoneTemplate: milestone,
      })
    },
    onMilestoneEdited ({ milestone }) {
      templatesStore.updateMilestoneTemplate({
        id: milestone.id,
        milestoneTemplate: milestone,
      })
    }
  }
})

function addMilestoneTemplate() {
  patchMilestoneTemplateModal({ attrs: { milestone: {} }})
  openMilestoneTemplateModal()
}

function editMilestoneTemplate({ milestone }) {
  patchMilestoneTemplateModal({ attrs: { milestone }})
  openMilestoneTemplateModal()
}

async function deleteMilestoneTemplate({ milestone }) {
  if (milestone.activityTemplates.length) {
    alert('You must delete all activities in a milestone before deleting the milestone.')
    return
  }

  const c = confirm('Are you sure you want to delete this milestone template?')

  if (c) {
    await templatesStore.deleteMilestoneTemplate({ id: milestone.id })
  }
}
</script>

<style lang="postcss" scoped>

</style>