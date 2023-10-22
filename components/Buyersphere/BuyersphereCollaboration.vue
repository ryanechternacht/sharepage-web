<template>
  <div>
    <div class="flex flex-col gap-5 items-center w-full">
      <div class="collaboration-box">
        <h3 class="self-center">+ New</h3>

        <BuyersphereCollaborationItem v-for="q in unansweredQuestions"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="true"
          @edit-item="editItem(q)" />
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">🔥 Active</h3>
        <div class="py-1 px-4 border border-gray-lighter rounded-md mx-auto mt-[-.5rem]">1 Week</div>

        <BuyersphereCollaborationItem v-for="q in activeItems"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(q)" />
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">🔮 Upcoming</h3>

        <BuyersphereCollaborationItem v-for="q in upcomingItems"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(q)" />
      </div>
      <div class="collaboration-box">
        <h3 class="self-center">✅ Completed</h3>

        <BuyersphereCollaborationItem v-for="q in completedItems"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(q)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit';
import lodash_pkg from 'lodash';
const { concat, filter, sortBy } = lodash_pkg;
import EditCollaborationItemModal from '@/components/Buyersphere/EditCollaborationItemModal.vue';
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const store = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(store)

const [buyersphere, conversations] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId)
])

const completedItems = computed(
  () => sortBy(
    filter(conversations, c => c.resolved),
    ['dueDate']
  )
)

var nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

const activeItems = computed(
  () => sortBy(
    filter(conversations, c => !c.resolved && new Date(c.dueDate) < nextWeek),
    ['dueDate']
  )
)

const upcomingItems = computed(
  () => sortBy(
    filter(conversations, c => !c.resolved && new Date(c.dueDate) >= nextWeek),
    ['dueDate']
  )
)

const allBuyersphereUsers = computed(
  () => concat(buyersphere.buyerTeam, buyersphere.sellerTeam)
)

const newQuestion = ref(null)
const newQuestionElem = ref(null)
const newDueDate = ref(null)
const newDueDateElem = ref(null)
const newAssignee = ref(null)
const newAssigneeElem = ref(null)

const { submissionState, submitFn } = useSubmit(async () =>
  await store.startConversation({ 
    buyersphereId, 
    message: newQuestion.value,
    dueDate: newDueDate.value,
    assignedTo: newAssignee.value,
  })
)

async function checkReady () {
  if (!newQuestion.value) {
    newQuestionElem.value.focus()
  } else if (!newDueDate.value) {
    newDueDateElem.value.openMenu()
  } else if (!newAssignee.value) {
    newAssigneeElem.value.focus()
  } else {
    await submitFn()
    newQuestion.value = null
    newDueDate.value = null
    newAssignee.value = null
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
</script>

<style lang="postcss" scoped>
.collaboration-box {
  @apply flex flex-col w-full border border-gray-lighter rounded-md
    px-4 py-2 gap-2
}
</style>
