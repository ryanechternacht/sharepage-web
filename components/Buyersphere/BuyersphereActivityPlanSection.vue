<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ items.length === 1 ? '1 activity' : `${items.length} activities`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="item in items"
        class="item-list-row"
        @click="emit('update:item', { item })">
        <img :src="iconMap[item.collaborationType]"
          class="w-[1rem] h-[1rem]">
        
          <Tag2 class="w-[4.75rem]" color="gray">
          {{ capitalize(item.collaborationType) }}
        </Tag2>
        
        <div class="inline-html main-content" v-html="item.message" />

        <template v-if="item.assignedTo" >
          <UserAvatar :user="item.assignedTo" />
          <div class="ml-[-.5rem] min-w-[8rem]">
            {{ item.assignedTo.firstName}} {{ item.assignedTo.lastName }}
          </div>
        </template>

        <template v-if="item.assignedTeam === 'seller'">
          <Logo :src="organization.logo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ organization.name }}</div>
        </template>
        
        <template v-else-if="isTemplate">
          <div class="template-buyer-logo">
            <img src="/svg/briefcase.svg">
          </div>
          <div class="ml-[-.5rem] min-w-[8rem]">Buying Company</div>
        </template>

        <template v-else>
          <Logo :src="item.buyer.logo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ item.buyer.name }}</div>
        </template>

        <div class="min-w-[5rem]">
          <div v-if="isTemplate">
            {{ item.dueDateDays === 1 
              ? `${item.dueDateDays} day` 
              : `${item.dueDateDays} days`}} out
          </div>
          <div v-else
            :class="{'text-red-secondary': overdue}">
            {{ prettyFormatDateFromToday(item.dueDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { capitalize } = lodash_pkg;

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [organization] = await Promise.all([
  getOrganizationCached.value(),
])

const props = defineProps({ 
  items: { type: Array, required: true },
  overdue: { type: Boolean, default: false },
  header: { type: String, required: true },
  isTemplate: { type: Boolean, default: false }
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
  @apply w-full flex flex-row items-center gap-4;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }
}

.template-buyer-logo {
  @apply w-[1.5rem] h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem]
    center-xy bg-gray-border rounded-md;
}
</style>