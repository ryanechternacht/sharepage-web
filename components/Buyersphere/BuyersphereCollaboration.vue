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
        <h3 class="self-center">🔮 Upcoming</h3>

        <BuyersphereCollaborationItem v-for="q in answeredQuestions"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(q)" />
      </div>
    </div>

    <!-- <div class="flex flex-col gap-y-2">
      <p class="bold">Create an Action Item:</p>
      <TipTapTextarea
        v-model="newQuestion"
        ref="newQuestionElem"
        placeholder="What needs to be done?"
        class="w-full" />
      <vue-date-picker 
        v-model="newDueDate"
        ref="newDueDateElem"
        :auto-apply="true"
        :enable-time-picker="false"
        placeholder="By when?" />
      <select v-model="newAssignee"
        ref="newAssigneeElem">
        <option disabled hidden value="null">Assigned to Whom?</option>
        <option v-for="u in allBuyersphereUsers"
          :value="u.id">
          {{ u.firstName }} {{ u.lastName }}
        </option>
      </select>
      <SubmitButton
        class="mx-auto"
        :submission-state="submissionState"
        ready-text="Create Action Item"
        submitting-text="Creating Action Item"
        submitted-text="Action Item Created" 
        @click="checkReady" />

      <div class="border border-gray-lighter" />

      <PillNav
        :options="sections"
        v-model:selected="section" />

      <template v-if="section === 'open'">
        <BuyersphereCollaborationItem v-for="q in unansweredQuestions"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="true"
          @edit-item="editItem(q)" />
      </template>

      <template v-if="section === 'completed'">
        <BuyersphereCollaborationItem v-for="q in answeredQuestions"
          :item="q"
          :buyersphere-id="buyersphereId"
          :resolved-state-when-clicked="false"
          @edit-item="editItem(q)" />
      </template>
    </div> -->
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

const sections = ['open', 'completed']
const section = ref('open')

const unansweredQuestions = computed(
  () => sortBy(
    filter(conversations, c => !c.resolved),
    ['dueDate']
  )
)
const answeredQuestions = computed(
  () => sortBy(
    filter(conversations, c => c.resolved),
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
