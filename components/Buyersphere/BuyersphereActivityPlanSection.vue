<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ activities.length === 1 ? '1 activity' : `${activities.length} activities`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="activity in activities"
        class="item-list-row"
        :class="{'cursor-pointer': isGlobalList}"
        @click="emit('click:activity', { activity })">
        <img :src="iconMap[activity.collaborationType]"
          class="w-[1rem] h-[1rem]"
          :class="{'hide-on-row-hover': !isTemplate}">
        <div v-if="!isTemplate" 
          class="show-on-row-hover">
          <img v-if="activity.resolved"
            src="/svg/reply.svg"
            class="cursor-pointer w-[1rem] h-[1rem]"
            @click.stop="emit('resolve:activity', { activity, resolved: false })">
          <div v-else
            class="circle"
            @click.stop="emit('resolve:activity', { activity, resolved: true })" />
        </div>
        
        <Tag2 class="w-[4.75rem]" color="gray">
          {{ capitalize(activity.collaborationType) }}
        </Tag2>
        
        <div class="inline-html main-content" v-html="activity.message" />

        <template v-if="activity.assignedTo">
          <UserAvatar :user="activity.assignedTo" />
          <div class="ml-[-.5rem] min-w-[8rem]">
            {{ activity.assignedTo.firstName}} {{ activity.assignedTo.lastName }}
          </div>
        </template>
        <template v-else-if="isGlobalList">
          <!-- If global, but unassigned, still show assigned team -->
          <template v-if="activity.assignedTeam === 'seller'">
            <Logo :src="organization.logo" />
            <div class="ml-[-.5rem] min-w-[8rem]">{{ organization.name }}</div>
          </template>
          <template v-else>
            <Logo :src="activity.buyer.logo" />
            <div class="ml-[-.5rem] min-w-[8rem]">{{ activity.buyer.name }}</div>
          </template>
        </template>


        <template v-if="isGlobalList">
          <!-- if global list, always show the buyersphere for the deal -->
          <Logo :src="activity.buyer.logo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ activity.buyer.name }}</div>
        </template>
        <template v-else-if="activity.assignedTeam === 'seller'">
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
          <Logo :src="activity.buyer.logo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ activity.buyer.name }}</div>
        </template>

        <div class="min-w-[5rem]"
          :class="{'hide-on-row-hover': !isGlobalList}">
          <div v-if="isTemplate">
            {{ activity.dueDateDays === 1 
              ? `${activity.dueDateDays} day` 
              : `${activity.dueDateDays} days`}} out
          </div>
          <div v-else
            :class="{'text-red-secondary': overdue}">
            {{ prettyFormatDateFromToday(activity.dueDate) }}
          </div>
        </div>

        <DeleteButton v-if="!isGlobalList"
          class="show-on-row-hover"
          @click.stop="emit('delete:activity', { activity })" />
        <EditButton v-if="!isGlobalList"
          class="show-on-row-hover"
          @click.stop="emit('update:activity', { activity })" />
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
  activities: { type: Array, required: true },
  overdue: { type: Boolean, default: false },
  header: { type: String, required: true },
  isTemplate: { type: Boolean, default: false },
  isGlobalList: { type: Boolean, default: false },
})

const emit = defineEmits([
  'click:activity',
  'update:activity',
  'delete:activity',
  'resolve:activity',
])

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
  action: '/svg/checkmark.svg',
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
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }

    .hide-on-row-hover {
      @apply hidden;
    }
  }
  
  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }
}

.show-on-row-hover {
  @apply hidden;
}

.template-buyer-logo {
  @apply w-[1.5rem] h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem]
    center-xy bg-gray-border rounded-md;
}

.circle {
  @apply rounded-full w-[1rem] h-[1rem] border border-gray-subtext cursor-pointer;
}
</style>