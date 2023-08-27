<template>
  <div>
    <div class="flex flex-col items-center gap-y-2">
      <h3>What's on your mind?</h3>
      <!-- TODO get an autogrow textarea -->
      <TipTapTextarea
        class="w-3/4"
        v-model="newConversation" />
      <SubmitButton
        class="bg-purple-dark w-[10rem] h-[2.5rem]"
        :submission-state="submissionState"
        ready-text="Start a Conversation"
        submitting-text="Sending Message"
        submitted-text="Message Sent"
        @click="submitFn" />
    </div>

    <div class="w-full mt-4 mb-2">
      <h3 class="text-center">Active and Recent</h3>
      <div class="flex flex-col gap-y-2">
        <div 
          v-for="c in unansweredQuestions"
          class="flex flex-row gap-x-2 items-start"
        >
          <PersonRow :person="c.author" class="w-[180px] shrink-0" />
          <div class="gray inline-html" v-html="c.message" />
        </div>
      </div>
      
      <h3 class="text-center mt-4 mb-2">Closed</h3>
      <div class="flex flex-col gap-y-2">
        <div
          v-for="c in answeredQuestions"
          class="flex flex-row gap-x-2 items-start"
        >
          <PersonRow :person="c.author" class="w-[180px] shrink-0"/>
          <div class="whitespace-pre">{{ c.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import { useSubmit } from '@/composables/useSubmit';

const newConversation = ref('')
const route = useRoute()
const buyersphereId = route.params.id

const store = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(store)

const [buyersphere, conversations] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId)
])

const unansweredQuestions = computed(
  () => conversations.filter(c => !c.resolved)
)
const answeredQuestions = computed(
  () => conversations.filter(c => c.resolved)
)

const { submissionState, submitFn } = useSubmit(async () => 
  await store.startConversation({ buyersphereId, message: newConversation })
)
</script>

<style lang="pcss" scoped>
</style>