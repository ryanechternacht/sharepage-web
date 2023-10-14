<template>
  <div>
    <div class="flex flex-col gap-y-2">
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
        ready-text="Create"
        submitting-text="Creating"
        submitted-text="Created" 
        @click="checkReady" />

      <div class="border border-gray-lighter" />

      <PillNav
        :options="sections"
        v-model:selected="section" />

      <template v-if="section === 'open'">
        <div v-for="q in unansweredQuestions">
          <div class="question-title">
            <span class="flex-grow">Assigned To: {{ q.assignedTo.firstName }} {{ q.assignedTo.lastName }}</span>
            <span class="italic">{{ formatDate(q.dueDate) }}</span>
          </div>
          <div class="question-body">
            <div class="question-text" v-html="q.message" />
            <div class="question-action"
              @click="updateQuestion({ id: q.id, resolved: true })">
              <img src="/svg/checkmark.svg">
            </div>
          </div>
        </div>
      </template>

      <template v-if="section === 'completed'">
        <div v-for="q in answeredQuestions">
          <div class="question-title">
            <span class="flex-grow">Assigned To: {{ q.assignedTo.firstName }} {{ q.assignedTo.lastName }}</span>
            <span class="italic">{{ formatDate(q.dueDate) }}</span>
          </div>
          <div class="question-body">
            <div class="question-text" v-html="q.message" />
            <div class="question-action"
              @click="updateQuestion({ id: q.id, resolved: false })">
              <img src="/svg/reply.svg">
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit';
import lodash_pkg from 'lodash';
const { concat, filter, sortBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = route.params.id

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

async function updateQuestion ({ id, resolved }) {
  store.updateConversation({ buyersphereId, conversationId: id, resolved })
}

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}
</script>

<style lang="postcss" scoped>
.question-title {
  @apply bg-teal-pastel flex flex-row rounded-t-md px-1.5 py-.5;
}

.question-body {
  @apply flex flex-row items-center border-gray-lighter 
    border-x border-b rounded-b-md p-1.5;
}

.question-text {
  @apply !gray inline-html w-full;
  
  * {
    @apply gray;
  }
}

.question-action {
  @apply center-xy border border-gray-light rounded-md cursor-pointer
    w-[1.25rem] min-w-[1.25rem] h-[1.25rem] min-h-[1.25rem] p-1;
}
</style>