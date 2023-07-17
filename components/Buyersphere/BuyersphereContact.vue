<template>
  <div>
    <div class="flex flex-col items-center gap-y-2">
      <h3>What's on your mind?</h3>
      <!-- TODO get an autogrow textarea -->
      <textarea 
        class="bg-gray-light w-3/4 rounded-md p-2 min-h-[40px]"
        v-model="newConversation"
      />
      <!-- TODO get this button standardized -->
      <button 
        class="bg-purple-dark w-[10rem] h-[2.5rem] rounded-md" 
        :disabled="sendMessageState === 'sending'"
        @click="startConversation">
        <div class="w-full h-full flex flex-row items-center justify-center text-white">
          {{ sendMessageButtonText }}
        </div>
      </button>
    </div>

    <div class="w-full mt-4 mb-2">
      <h3 class="text-center">Active and Recent</h3>
      <div class="flex flex-col gap-y-2">
        <div 
          v-for="c in unansweredQuestions"
          class="flex flex-row gap-x-2 items-start"
        >
          <PersonRow :person="c.author" class="w-[180px] shrink-0" />
          <div class="whitespace-pre">{{ c.message }}</div>
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
import Editor from '@tinymce/tinymce-vue'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'

const newConversation = ref('')

// TODO make this a reusable pattern?
// submit button?
const sendMessageState = ref('ready')
const sendMessageButtonText = computed(
  () => ({
    'ready': 'Start a Conversation',
    'sending': 'Sending Message',
    'sent': 'Message Sent!'
  }[sendMessageState.value])
)

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

async function startConversation () {
  sendMessageState.value = 'sending'
  await store.startConversation({ buyersphereId, message: newConversation })
  sendMessageState.value = 'sent'
  setInterval(() => sendMessageState.value = 'ready', 5000)
}
</script>
