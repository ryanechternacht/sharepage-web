<template>
  <div>
    <div class="question-title">
      <span class="flex-grow">Assigned To: {{ item.assignedTo.firstName }} {{ item.assignedTo.lastName }}</span>
      <span class="italic">{{ formatDate(item.dueDate) }}</span>
    </div>
    <div class="question-body">
      <div class="question-text" v-html="item.message" />
      <div class="question-action"
        @click="emit('edit-item')">
        <img src="/svg/edit.svg">
      </div>
      <div class="question-action"
        @click="updateQuestion({ id: item.id, resolved: props.resolvedStateWhenClicked })">
        <img :src="resolvedStateWhenClicked ? '/svg/checkmark.svg' : '/svg/reply.svg'">
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const store = useBuyerspheresStore()

const props = defineProps({
  item: { type: Object, required: true },
  buyersphereId: { type: Number, required: true },
  resolvedStateWhenClicked: { type: Boolean, required: true }
})

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}

async function updateQuestion ({ id, resolved }) {
  store.updateConversation({ buyersphereId: props.buyersphereId, conversationId: id, resolved })
}

const emit = defineEmits(['edit-item'])
</script>

<style lang="postcss" scoped>
.question-title {
  @apply bg-teal-pastel flex flex-row rounded-t-md px-1.5 py-.5;
}

.question-body {
  @apply flex flex-row gap-x-1 items-center border-gray-lighter 
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