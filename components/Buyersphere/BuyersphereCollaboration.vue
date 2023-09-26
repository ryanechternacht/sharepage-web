<template>
  <div>
    <div class="flex flex-col gap-y-2">
      <p class="bold">Ask a question:</p>
      <TipTapTextarea
        v-model="newQuestion"
        placeholder="Enter your question"
        class="w-full h-12" />
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
            <span class="flex-grow">From: {{ q.author.firstName }} {{ q.author.lastName }}</span>
            <span class="italic">{{ formatDate(q.createdAt) }}</span>
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

      <template v-if="section === 'resolved'">
        <div v-for="q in answeredQuestions">
          <div class="question-title">
            <span class="flex-grow">From: {{ q.author.firstName }} {{ q.author.lastName }}</span>
            <span class="italic">{{ formatDate(q.createdAt) }}</span>
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

const newQuestion = ref(null)
const route = useRoute()
const buyersphereId = route.params.id

const store = useBuyerspheresStore()
const { getBuyersphereConversationsByIdCached } = storeToRefs(store)

const [conversations] = await Promise.all([
  getBuyersphereConversationsByIdCached.value(buyersphereId)
])

const sections = ['open', 'resolved']
const section = ref('open')

const unansweredQuestions = computed(
  () => conversations.filter(c => !c.resolved)
)
const answeredQuestions = computed(
  () => conversations.filter(c => c.resolved)
)

const { submissionState, submitFn } = useSubmit(async () =>
  await store.startConversation({ buyersphereId, message: newQuestion.value })
)

async function checkReady () {
  if (newQuestion.value) {
    await submitFn()
    newQuestion.value = null
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