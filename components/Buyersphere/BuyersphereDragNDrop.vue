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
    <div v-for="milestone in groups"
      class="section">
      <div class="group-header">
        {{ milestone.title }}
        <EditButton @click="editMilestone({ milestone })" class="show-on-hover" />
      </div>
      <!-- <VueDraggable 
        v-model="milestone.activities" 
        group="activities"
        ghost-class="ghost"
        animation="200"
        item-key="id"
        class="mt-[2rem] flex flex-col gap-4"
        handle=".drag-handle"
      > -->
      <div class="mt-[2rem] flex flex-col gap-4">
        <BuyersphereActivityItem
        v-for="activity in milestone.activities"
        :key="activity.id"
        :activity="activity"
        @update:activity="editActivity"
        @delete:activity="deleteActivity"
        @resolve:activity="resolveActivity" />
      </div>
      <!-- </VueDraggable> -->
      <NewButton class="section-add-button"
        @click="addActivity({ milestoneId: milestone.id })" />
    </div>

    <div class="section">{{ activities }}</div>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, find, orderBy, map } = lodash_pkg;
import AddEditActivityItemModal2 from '@/components/Buyersphere/AddEditActivityItemModal2';
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
  ['ordering'],
  ['asc'])
)

const {
  open: openItemModal,
  close: closeItemModal,
  patchOptions: patchItemModal
} = useModal({
  component: AddEditActivityItemModal2,
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
    onActivityEdited ({ activity, milestoneId }) {
      buyerspheresStore.updateBuyersphereActivity({
        buyersphereId,
        milestoneId,
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
  patchItemModal({ attrs: { activity }})
  openItemModal()
}

async function deleteActivity({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await buyerspheresStore.deleteBuyersphereActivity({ buyersphereId, id: activity.id })
  }
}

async function resolveActivity({ activity, resolved }) {
  // await buyerspheresStore.updateConversation({ 
  //   buyersphereId: buyersphereId,
  //   conversationId: activity.id,
  //   resolved: resolved,
  // })
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

async function deleteMilestone({ activity }) {
  const c = confirm(`Are you sure you want to delete this action item`)

  if (c) {
    await buyerspheresStore.deleteConversation({ buyersphereId, conversationId: activity.id })
  }
}

async function resolveMilestone({ activity, resolved }) {
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

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  /* background-color: red; */
  /* border: 4px solid black; */
}

.show-on-hover {
  @apply hidden;
}

*:has(> .show-on-hover):hover {
  .show-on-hover {
    @apply block;
  }
}
</style>
