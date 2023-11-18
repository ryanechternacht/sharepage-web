<template>
  <div class="flex flex-row items-center gap-4 bg-white px-4 py-2">
    <div>{{ icon }}</div>
    <Tag color="red">Overdue</Tag>
    <div class="flex-grow">{{ item.message }}</div>
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
</script>

<style lang="postcss" scoped>
</style>