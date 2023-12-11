<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="item in items"
        class="item-list-row"
        @click="emit('update:item', { item })">
        <img :src="iconMap[item.collaborationType]">
        <div class="inline-html" v-html="item.message" />
        <div class="flex-grow" />
        <div class="w-[9.5rem] flex flex-row items-center gap-1 justify-end">
          <div class="tag"
            :class="{'text-red-secondary': overdue}">
            {{ prettyFormatDateFromToday(item.dueDate) }}
          </div>
          <UserAvatar v-if="item.assignedTo" :user="item.assignedTo" />
          <Logo v-if="item.assignedTeam === 'buyer'"
              :src="item.buyer.logo" />
          <Logo v-else
            :src="organization.logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [organization] = await Promise.all([
  getOrganizationCached.value(),
])

const props = defineProps({ 
  items: { type: Array, required: true },
  overdue: { type: Boolean, default: false },
  header: { type: String, required: true },
})

const emit = defineEmits(['update:item'])

const dayjs = useDayjs()
const todayDayJs = dayjs(new Date().setHours(0,0,0,0))
function prettyFormatDateFromToday(date) {
  const d = dayjs(date)
  const daysApart = d.diff(todayDayJs, 'days')

  const dateFormat = 'MMM Do'

  if (daysApart < -7) {
    return d.format(dateFormat)
  } else if (daysApart < -1) {
    return `${-daysApart} days ago`
  } else if (daysApart === -1) {
    return "Yesterday"
  } else if (daysApart === 0) {
    return "Today"
  } else if (daysApart === 1) {
    return "Tomorrow"
  } else if (daysApart < 7) {
    return `in ${daysApart} days`
  } else {
    return d.format(dateFormat)
  }
}

const iconMap = {
  task: '/svg/checkmark.svg',
  question: '/svg/speech-bubble.svg',
  comment: '/svg/caution-sign.svg',
  milestone: '/svg/award.svg',
  meeting: '/svg/calendar.svg'
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>