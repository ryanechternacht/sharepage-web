<template>
  <div class="[grid-area:center-header] center-header">
    <!-- <BsButtonGroup 
      :options="filterOptions"
      header="Assigned To"
      @update:option="updateFilter" /> -->
  </div>

  <div class="[grid-area:right-header] right-header">
    <div class="h-full flex flex-row-reverse items-end">
      <NewButton v-if="hasUser" 
        @click="addMilestone"
        text="New Milestone" />
    </div>
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'discovery-guide')">Discovery Guide</NuxtLink>
      <h3 class="page-link">Activity Plan</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <!-- TODO grey these that are done -->
        <a v-for="m in milestones"
          class="in-page-link"
          :href="`#${m.title}`">{{ m.title }}</a>
        <!-- <a v-if="overdueItems.length" 
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
          href="#completed">Completed</a> -->
      </div>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'team')">Team</NuxtLink>
      <NuxtLink class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'assets')">Assets</NuxtLink>
      <NuxtLink v-if="isSeller"
        class="page-link"
        :to="makeBuyersphereLink(buyersphere, 'insights')">Insights</NuxtLink>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <BuyersphereActivityPlanSection
      v-for="milestone in groups"
      :id="milestone.title"
      :milestone="milestone"
      :activities="milestone.activities"
      @update:milestone="editMilestone"
      @resolve:milestone="resolveMilestone"
      @unresolve:milestone="unresolveMilestone"
      @delete:milestone="deleteMilestone"
      @create:activity="addActivity"
      @update:activity="editActivity"
      @resolve:activity="resolveActivity"
      @delete:activity="deleteActivity"
    />

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { every, filter, find, orderBy, map } = lodash_pkg;
import AddEditActivityItemModal from '@/components/Buyersphere/AddEditActivityItemModal';
import AddEditActivityMilestoneModal from '@/components/Buyersphere/AddEditActivityMilestoneModal';
import { useModal } from 'vue-final-modal'
// import { VueDraggable } from 'vue-draggable-plus'

const { makeBuyersphereLink } = useBuyersphereLinks()

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyerspheresStore = useBuyerspheresStore()
const { 
  getBuyersphereByIdCached,
  getBuyersphereMilestonesByIdCached,
  getBuyersphereActivitiesByIdCached,
} = storeToRefs(buyerspheresStore)

const usersStore = useUsersStore()
const { getMeCached, isUserLoggedIn, isUserSeller,  } = storeToRefs(usersStore)

const [buyersphere, milestones, activities, me, hasUser, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereMilestonesByIdCached.value(buyersphereId),
  getBuyersphereActivitiesByIdCached.value(buyersphereId),
  getMeCached.value(),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

const groups = computed(() => 
  orderBy(
    map(milestones, (m) => {
      m.activities = filter(activities, (a) => a.milestoneId === m.id)
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
      buyerspheresStore.createBuyersphereActivity({
        buyersphereId,
        milestoneId,
        activity
      })
    },
    onActivityEdited ({ activity }) {
      buyerspheresStore.updateBuyersphereActivity({
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

function editActivity({ activity }) {
  patchItemModal({ attrs: { activity, milestoneId: activity.milestoneId }})
  openItemModal()
}

async function deleteActivity({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await buyerspheresStore.deleteBuyersphereActivity({ buyersphereId, id: activity.id })
  }
}

async function resolveActivity({ activity, resolved }) {
  buyerspheresStore.updateBuyersphereActivity({
    buyersphereId,
    milestoneId: activity.milestoneId,
    id: activity.id,
    activity: { resolved }
  })
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
      buyerspheresStore.createBuyersphereMilestone({
        buyersphereId,
        milestone,
      })
    },
    onMilestoneEdited ({ milestone }) {
      buyerspheresStore.updateBuyersphereMilestone({
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
    await buyerspheresStore.deleteBuyersphereMilestone({ buyersphereId, id: milestone.id })
  }
}

async function resolveMilestone({ milestone }) {
  const c = confirm(`Are you sure you want to mark this milestone resolved?`)

  if (c) {
    milestone.resolved = true
    await buyerspheresStore.updateBuyersphereMilestone({
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
    await buyerspheresStore.updateBuyersphereMilestone({
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
