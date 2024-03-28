<template>
  <div class="[grid-area:center-header] center-header">
    <BsButtonGroup 
      :options="filterOptions"
      header="Assigned To"
      @update:option="updateFilter" />
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="h-full flex flex-row-reverse items-end">
      <NewButton v-if="hasUser" 
        @click="addMilestone"
        text="New Milestone" />
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <SwaypageActivityPlanSection
      v-for="milestone in groups"
      :id="milestone.title"
      :milestone="milestone"
      :activities="milestone.activities"
      :has-user="hasUser"
      @update:milestone="editMilestone"
      @resolve:milestone="resolveMilestone"
      @unresolve:milestone="unresolveMilestone"
      @delete:milestone="deleteMilestone"
      @create:activity="addActivity"
      @update:activity="editActivity"
      @resolve:activity="resolveActivity"
      @delete:activity="deleteActivity"
    />
    <div class="bottom-cover" />
    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/buyerspheres'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy, map } = lodash_pkg;
import AddEditActivityItemModal from '@/components/Swaypage/AddEditActivityItemModal';
import AddEditActivityMilestoneModal from '@/components/Swaypage/AddEditActivityMilestoneModal';
import { useModal } from 'vue-final-modal'
// import { VueDraggable } from 'vue-draggable-plus'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyerspheresStore = useSwaypagesStore()
const { 
  getSwaypageMilestonesByIdCached,
  getSwaypageActivitiesByIdCached,
} = storeToRefs(buyerspheresStore)

const usersStore = useUsersStore()
const { getMeCached, isUserLoggedIn, isUserSeller,  } = storeToRefs(usersStore)

const [milestones, activities, me, hasUser, isSeller] = await Promise.all([
  getSwaypageMilestonesByIdCached.value(buyersphereId),
  getSwaypageActivitiesByIdCached.value(buyersphereId),
  getMeCached.value(),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

const userTeam = (hasUser && isSeller ? 'seller' : 'buyer')
const userId = hasUser ? me.id : -100

const filterOptions = computed(() => [
  {text: 'Anyone', active: true},
  {text: 'Me', active: find(activities, a => a.assignedTo?.id === userId)},
  {text: 'Us', active: find(activities, a => a.assignedTeam === userTeam)},
  {text: 'Them', active: find(activities, a => a.assignedTeam !== userTeam)},
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
        a => a.assignedTo?.id === userId),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Us') {
    return orderBy(
      filter(activities, 
        a => a.assignedTeam === userTeam),
      ['dueDate'],
      ['asc']
    )
  } else if (currentFilter.value === 'Them') {
    return orderBy(
      filter(activities, 
        a => a.assignedTeam !== userTeam),
      ['dueDate'],
      ['asc']
    )
  } else {
    return []
  }
})

const groups = computed(() => 
  orderBy(
    map(milestones, (m) => {
      m.activities = filter(filteredActivities.value, (a) => a.milestoneId === m.id)
      return m
    }),
  ['resolved', 'ordering'],
  ['asc', 'asc'])
)

const {
  open: openItemModal,
  close: closeItemModal,
  patchOptions: patchItemModal
} = useModal({
  component: AddEditActivityItemModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeItemModal ()
    },
    onActivityCreated ({ activity, milestoneId }) {
      buyerspheresStore.createSwaypageActivity({
        buyersphereId,
        milestoneId,
        activity
      })
    },
    onActivityEdited ({ activity }) {
      buyerspheresStore.updateSwaypageActivity({
        buyersphereId,
        id: activity.id,
        activity
      })
    },
  }
})

function addActivity({ milestoneId }) {
  patchItemModal({ attrs: { activity: {}, milestoneId }})
  openItemModal()
}

const emit = defineEmits(['require-login'])

function editActivity({ activity }) {
  if (hasUser) {
    patchItemModal({ attrs: { activity, milestoneId: activity.milestoneId }})
    openItemModal()
  } else {
    emit('require-login')
  }
}

async function deleteActivity({ activity }) {
  if (!hasUser) {
    emit('require-login')
    return
  }
  
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await buyerspheresStore.deleteSwaypageActivity({ buyersphereId, id: activity.id })
  }
}

async function resolveActivity({ activity, resolved }) {
  if (hasUser) {
    buyerspheresStore.updateSwaypageActivity({
      buyersphereId,
      milestoneId: activity.milestoneId,
      id: activity.id,
      activity: { resolved }
    })
  } else {
    emit('require-login')
  }
}

const {
  open: openMilestoneModal,
  close: closeMilestoneModal,
  patchOptions: patchMilestoneModal
} = useModal({
  component: AddEditActivityMilestoneModal,
  attrs: {
    buyersphereId,
    onClose () {
      closeMilestoneModal ()
    },
    onMilestoneCreated ({ milestone }) {
      buyerspheresStore.createSwaypageMilestone({
        buyersphereId,
        milestone,
      })
    },
    onMilestoneEdited ({ milestone }) {
      buyerspheresStore.updateSwaypageMilestone({
        buyersphereId,
        id: milestone.id,
        milestone,
      })
    }
  }
})

function addMilestone() {
  patchMilestoneModal({ attrs: { milestone: {} }})
  openMilestoneModal()
}

function editMilestone({ milestone }) {
  patchMilestoneModal({ attrs: { milestone }})
  openMilestoneModal()
}

async function deleteMilestone({ milestone }) {
  if (milestone.activities.length) {
    alert('You must delete all activities in a milestone before deleting the milestone')
    return
  }

  const c = confirm(`Are you sure you want to delete this milestone`)

  if (c) {
    await buyerspheresStore.deleteSwaypageMilestone({ buyersphereId, id: milestone.id })
  }
}

async function resolveMilestone({ milestone }) {
  const c = confirm(`Are you sure you want to mark this milestone resolved?`)

  if (c) {
    milestone.resolved = true
    await buyerspheresStore.updateSwaypageMilestone({
      buyersphereId,
      id: milestone.id,
      milestone,
    }) 
  }
}

async function unresolveMilestone({ milestone }) {
  const c = confirm(`Are you sure you want to open this milestone back up?`)

  if (c) {
    milestone.resolved = false
    await buyerspheresStore.updateSwaypageMilestone({
      buyersphereId,
      id: milestone.id,
      milestone,
    }) 
  }
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
