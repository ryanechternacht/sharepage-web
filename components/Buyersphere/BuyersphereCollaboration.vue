<template>
  <div>
    <div class="flex flex-col gap-5 items-center w-full">
      <div class="collaboration-box !gap-1">
      <h3 class="self-center">+ New</h3>
        <TipTapTextarea
          v-model="newMessage"
          ref="newMessageElem"
          placeholder="What needs to be done?"
          class="w-full" />
        <select v-model="newCollaborationType"
          ref="newCollaborationTypeElem">
          <option disabled hidden value="null">What type of Item?</option>
          <option value="comment">Comment</option>
          <option value="meeting">Meeting</option>
          <option value="question">Question</option>
          <option value="task">Task</option>
        </select>
        <vue-date-picker 
          v-model="newDueDate"
          ref="newDueDateElem"
          :auto-apply="true"
          :enable-time-picker="false"
          model-type="yyyy-MM-dd"
          placeholder="By when?"
          input-class-name="date-picker" />
        <select v-model="newAssignedToId"
          ref="newAssignedToIdElem">
          <option disabled hidden value="null">Assigned to Whom?</option>
          <option v-for="u in allBuyersphereUsers"
            :value="u.id">
            {{ u.firstName }} {{ u.lastName }}
          </option>
        </select>
        <SubmitButton
          class="mx-auto"
          :submission-state="submissionState"
          ready-text="Create"
          submitting-text="Creating"
          submitted-text="Created" 
          @click="checkReady" />
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">🔥 Active</h3>
        <div class="py-1 px-4 border border-gray-lighter rounded-md mx-auto mt-[-.5rem]">Next 7 days</div>

        <template v-for="g in activeItemsGrouped">
          <div class="date-header ">{{ formatDate(g.date) }}</div>
          <BuyersphereCollaborationItem v-for="q in g.items"
            :item="q"
            :buyersphere-id="buyersphereId"
            :resolved-state-when-clicked="true"
            @edit-item="editItem(q)" />
        </template>
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">🔮 Upcoming</h3>

        <template v-for="g in upcomingItemsGrouped">
          <div class="date-header ">{{ formatDate(g.date) }}</div>
          <BuyersphereCollaborationItem v-for="q in g.items"
            :item="q"
            :buyersphere-id="buyersphereId"
            :resolved-state-when-clicked="true"
            @edit-item="editItem(q)" />
        </template>
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">✅ Completed</h3>

        <template v-for="g in completedItemsGrouped">
          <div class="date-header ">{{ formatDate(g.date) }}</div>
          <BuyersphereCollaborationItem v-for="q in g.items"
            :item="q"
            :buyersphere-id="buyersphereId"
            :resolved-state-when-clicked="false"
            @edit-item="editItem(q)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, find, groupBy, map, orderBy } = lodash_pkg;
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

const allBuyersphereUsers = computed(
  () => concat(
    {
      id: -1,
      firstName: buyersphere.buyer,
      lastName: "Team",
      team: "buyer"
    },
    buyersphere.buyerTeam ?? [], 
    {
      id: -2,
      firstName: organization.name,
      lastName: "Team",
      team: "seller"
    },
    buyersphere.sellerTeam ?? [])
)

const newMessage = ref(null)
const newMessageElem = ref(null)
const newCollaborationType = ref(null)
const newCollaborationTypeElem = ref(null)
const newDueDate = ref(null)
const newDueDateElem = ref(null)
const newAssignedToId = ref(null)
const newAssignedToIdElem = ref(null)
const newAssignedTeam = computed(() => 
  find(allBuyersphereUsers.value, u => u.id === newAssignedToId.value).team
)

const { submissionState, submitFn } = useSubmit(async () =>
  await buyersphereStore.startConversation({ 
    buyersphereId, 
    message: newMessage.value,
    dueDate: newDueDate.value,
    assignedTo: newAssignedToId.value > 0 ? newAssignedToId.value : null,
    assignedTeam: newAssignedTeam.value,
    collaborationType: newCollaborationType.value,
  })
)

async function checkReady () {
  if (!newMessage.value) {
    newMessageElem.value.focus()
  } else if (!newCollaborationType.value) {
    newCollaborationTypeElem.value.focus()
  } else if (!newDueDate.value) {
    newDueDateElem.value.openMenu()
  } else if (!newAssignedTeam.value) {
    newAssignedToIdElem.value.focus()
  } else {
    await submitFn()
    newMessage.value = null
    newDueDate.value = null
    newAssignedToId.value = null
    newCollaborationType.value = null
  }
}

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

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}
</script>

<style lang="postcss" scoped>
.collaboration-box {
  @apply flex flex-col w-full border border-gray-lighter rounded-md
    px-4 py-2 gap-2
}

.date-header {
  @apply tag gray-italic self-end mb-[-.25rem];
}

select, :deep(.editor) {
  @apply p-0.5;
}

:deep(.date-picker) {
  @apply text-sm py-0.5 pr-0.5 pl-[1.75rem];
}

:deep(.dp__input_wrap) svg {
  @apply px-2;
}
</style>
