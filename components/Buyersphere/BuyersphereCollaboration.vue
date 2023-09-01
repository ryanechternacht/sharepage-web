<template>
  <div>
    <div class="flex flex-col gap-y-2">
      <p class="bold">Ask a question:</p>
      <TipTapTextarea
        v-model="newQuestion"
        class="w-full h-12" />
      <SubmitButton
        class="mx-auto"
        :submission-state="submissionState"
        ready-text="Create"
        submitting-text="Creating"
        submitted-text="Created" 
        @click="checkReady" />

      <div class="border border-gray-lighter" />

      <div v-for="q in unansweredQuestions">
        <div class="bg-teal-pastel flex flex-row rounded-t-md px-1.5 py-.5">
          <span class="flex-grow">From: {{ q.author.firstName }} {{ q.author.lastName }}</span>
          <span class="italic">{{ formatDate(q.createdAt) }}</span>
        </div>
        <div class="flex flex-row items-center gap-x border-gray-lighter border-x border-b rounded-b-md p-1.5">
          <div class="gray inline-html" v-html="q.message" />
          <div class="border border-gray-mid rounded-md p-1.5 text-[.5rem]">✔️</div>
        </div>
      </div>
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

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}
</script>

<style lang="postcss" scoped>
</style>