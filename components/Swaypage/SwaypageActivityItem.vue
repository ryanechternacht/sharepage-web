<template>
  <div
    class="item-list-row"
    :class="{'cursor-pointer': isGlobalList,
              completed: activity.resolved}"
    @click="emit('click:activity', { activity })">
    <img :src="iconMap[activity.activityType]"
      class="w-[1rem] h-[1rem]"
      :class="{'hide-on-row-hover': showResolveButton}">
    <div v-if="showResolveButton" 
      class="show-on-row-hover">
      <div v-if="activity.resolved"
        @click.stop="emit('resolve:activity', { activity, resolved: false })">
        <RotateCcwIcon class="cursor-pointer w-[1rem] h-[1rem]" />
      </div>
      <div v-else
        class="circle"
        @click.stop="emit('resolve:activity', { activity, resolved: true })" />
    </div>
    
    <Tag class="w-[4.75rem]" color="gray">
      {{ capitalize(activity.activityType) }}
    </Tag>
    
    <div class="inline-html main-content" v-html="activity.title" />

    <div v-if="activity.dueDate" class="min-w-[5rem]"
      :class="{'text-red-secondary': isDateOverdue(activity.dueDate)}">
      {{ prettyFormatDateFromToday(activity.dueDate) }}
    </div>

    <div class="flex flex-row gap-2 min-w-[10rem]" 
      :class="{'hide-on-row-hover': !isGlobalList && showEditDeleteButtons}">
      <Logo v-if="activity.assignedTeam === 'seller'"
        :src="organization.logo" />
      <div v-else-if="isTemplate" class="template-buyer-logo">
        <BriefcaseIcon />
      </div>
      <Logo v-else :src="activity.buyer.logo" />

      <div v-if="activity.assignedTo">
        {{ activity.assignedTo.firstName}} {{ activity.assignedTo.lastName }}
      </div>
      <div v-else-if="activity.assignedTeam === 'seller'">
        {{ organization.name }}
      </div>
      <div v-else-if="isTemplate">
        Buying Company
      </div>
      <div v-else>
        {{ activity.buyer.name }}
      </div>
    </div>

    <div v-if="isGlobalList"
      class="flex flex-row gap-2 min-w-[10rem]">
      <Logo :src="activity.buyer.logo" />
      <div>{{ activity.buyer.name }}</div>
    </div>


    <div v-if="showEditDeleteButtons" 
      class="show-on-row-hover min-w-[10rem] flex flex-row-reverse flex-end gap-4 items-center">
      <!-- <MenuIcon v-if="showEditDeleteButtons" 
        class="drag-handle"/> -->
      <EditButton v-if="showEditDeleteButtons"
        @click.stop="emit('update:activity', { activity })" />
      <DeleteButton v-if="showEditDeleteButtons"
        @click.stop="emit('delete:activity', { activity })" />
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
  activity: { type: Object, required: true },
  overdue: { type: Boolean, default: false },
  isTemplate: { type: Boolean, default: false },
  isGlobalList: { type: Boolean, default: false },
  isUserLoggedIn: { type: Boolean, default: true },
})

const showResolveButton = props.isUserLoggedIn && !props.isTemplate
const showEditDeleteButtons = props.isUserLoggedIn && !props.isGlobalList

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

function isDateOverdue(date) {
  const d = dayjs(date)
  const daysApart = d.diff(todayDayJs, 'days')
  return daysApart < 0
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

  &.completed * {
    @apply line-through;
  }
}

.show-on-row-hover {
  @apply hidden;
}

.template-buyer-logo {
  /* @apply w-[1.5rem] h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem]
    center-xy rounded-md; */
  @apply w-[1.5rem] h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem] rounded-md;
  /* ryan */
}

.circle {
  @apply rounded-full w-[1rem] h-[1rem] border border-gray-subtext cursor-pointer;
}
</style>