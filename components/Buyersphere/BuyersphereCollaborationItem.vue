<template>
  <div class="collaboration-item"
    @click="emit('edit-item')">
    <div class="p-0.5 text-base border border-gray-lighter rounded-md">
      {{ icon }}
    </div>
    <div class="flex-grow inline-html" v-html="item.message"/>
    
    <div class="avatar">
      <UserAvatar v-if="item.assignedTo" 
        :user="item.assignedTo" />
      <Logo v-else-if="item.assignedTeam === 'buyer'"
        :src="buyersphere.buyerLogo" />
      <Logo v-else
        :src="organization.logo" />
    </div>
    
    <img class="resolve-button hidden"
      :src="resolvedStateWhenClicked ? '/svg/checkmark.svg' : '/svg/reply.svg'"
      @click.stop="updateQuestion({ id: item.id, resolved: props.resolvedStateWhenClicked })">
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization';
import { storeToRefs } from 'pinia'

const props = defineProps({
  item: { type: Object, required: true },
  buyersphereId: { type: Number, required: true },
  resolvedStateWhenClicked: { type: Boolean, required: true }
})

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(props.buyersphereId),
  getOrganizationCached.value()
])

// const dayjs = useDayjs()
// function formatDate(date) {
//   return dayjs(date).format('MMM D')
// }

async function updateQuestion ({ id, resolved }) {
  buyersphereStore.updateConversation({ buyersphereId: props.buyersphereId, conversationId: id, resolved })
}

const icon = computed(() => {
  return {
    task: '📝',
    question: '❓',
    comment: '❗',
    meeting: '🗓️'
  }[props.item.collaborationType]
}
)

const emit = defineEmits(['edit-item'])
</script>

<style lang="postcss" scoped>
.collaboration-item {
  @apply grid items-center w-full gap-2 cursor-pointer;
  grid-template-columns: auto 1fr auto;

  &:hover .resolve-button {
    @apply block;
  }

  &:hover .avatar {
    @apply hidden;
  }
}

.resolve-button {
  @apply w-6 p-1 border border-gray-lighter rounded-md cursor-pointer;
}

.avatar {
  @apply w-6;
}
</style>
