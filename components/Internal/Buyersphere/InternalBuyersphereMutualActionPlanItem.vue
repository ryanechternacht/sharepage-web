<template>
  <div class="collaboration-item"
    @click="emit('edit-item')">
    <div class="w-4">
      <div class="item-icon">{{ icon }}</div>
      <img class="resolve-button hidden"
        :src="resolvedStateWhenClicked ? '/svg/checkmark.svg' : '/svg/reply.svg'"
        @click.stop="updateQuestion({ id: item.id, resolved: props.resolvedStateWhenClicked })">
    </div>
  
    <Tag color="red">Overdue</Tag>
    <div class="flex-grow inline-html" v-html="item.message" />
    <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
    <Logo v-if="item.assignedTeam === 'buyer'"
        :src="buyersphere.buyerLogo" />
    <Logo v-else
      :src="organization.logo" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

const props = defineProps({
  item: { type: Object, required: true },
  buyersphereId: { type: Number, required: true },
  resolvedStateWhenClicked: { type: Boolean, required: true }
})

const emit = defineEmits(['edit-item'])

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(props.buyersphereId),
  getOrganizationCached.value()
])

const icon = computed(() => {
  if (props.item.collaborationType === 'meeting') {
    return '🗓️'
  }

  else if (props.item.collaborationType === 'task') {
    if (props.item.resolved) {
      return '✅'
    }
    return new Date(props.item.dueDate) < new Date() ? '🔥' : '📝'
  }

  else if (props.item.collaborationType === 'question') {
    if (props.item.resolved) {
      return '❓'
    }
    return new Date(props.item.dueDate) < new Date() ? '🤔' : '❓'
  }

  else if (props.item.collaborationType === 'comment') {
    if (props.item.resolved) {
      return '❗'
    }
    return new Date(props.item.dueDate) < new Date() ? '👉' : '❗'
  }
})

async function updateQuestion ({ id, resolved }) {
  buyersphereStore.updateConversation({ buyersphereId: props.buyersphereId, conversationId: id, resolved })
}
</script>

<style lang="postcss" scoped>
.collaboration-item {
  @apply flex flex-row items-center gap-4 bg-white px-4 py-2 cursor-pointer;

  &:hover .resolve-button{
    @apply block;
  }

  &:hover .item-icon {
    @apply hidden;
  }
}

.item-icon, .resolve-button {
  @apply w-full text-center;
}

.resolve-button {
  @apply py-[.375rem] px-.5 rounded-md hover:bg-gray-lighter;
}
</style>