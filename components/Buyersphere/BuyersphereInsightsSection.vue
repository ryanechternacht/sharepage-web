<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ items.length === 1 ? '1 insight' : `${items.length} insights`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="item in items"
        class="item-list-row">
        <img :src="activityMap[item.activity]?.icon"
          class="w-[1rem] h-[1rem]">
        <Tag2 color="gray">{{ activityMap[item.activity]?.label }}</Tag2>
        <div 
        v-html="activityMap[item.activity]?.detailsFn(item.activityData)"
        class="main-content inline-html" />

        <UserAvatar :user="item.user" />
        <div class="ml-[-.5rem] min-w-[8rem]">{{ item.user.firstName}} {{ item.user.lastName }}</div>

        <template v-if="showAccount">
          <Logo :src="item.buyersphere.buyerLogo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ item.buyersphere.buyer }}</div>
        </template>

        <div class="tag min-w-[4rem]">
          {{ prettyFormatDateFromToday(item.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  items: { type: Array, required: true },
  header: { type: String, required: true },
  showAccount: { type: Boolean, default: false },
})

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
  }
}

const activityMap = {
  'site-activity': {
    icon: '/svg/eye.svg',
    label: 'Opened Buyersphere',
    detailsFn: () => '',
  },
  'create-activity': {
    icon: '/svg/eye.svg',
    label: 'Created Activity',
    detailsFn: (activityData) => activityData?.message,
  },
  'edit-activity': {
    icon: '/svg/eye.svg',
    label: 'Edited Activity',
    detailsFn: (activityData) => activityData?.message,
  },
  'resolve-activity': {
    icon: '/svg/eye.svg',
    label: 'Resolved Activity',
    detailsFn: (activityData) => activityData?.message,
  },
  'unresolve-activity': {
    icon: '/svg/eye.svg',
    label: 'Re-opened Activity',
    detailsFn: (activityData) => activityData?.message,
  },
  'delete-activity': {
    icon: '/svg/eye.svg',
    label: 'Deleted Activity',
    detailsFn: (activityData) => activityData?.message,
  },
  'edit-constraints': {
    icon: '/svg/eye.svg',
    label: '',
    detailsFn: () => 'Edited the Deal Constraints'
  },
  'edit-success-criteria': {
    icon: '/svg/eye.svg',
    label: 'Edited the Deal Success Criteria',
    detailsFn: () => '',
  },
  'edit-features': {
    icon: '/svg/eye.svg',
    label: 'Edited the Deal Features',
    detailsFn: () => '',
  },
  'edit-objectives': { 
    icon: '/svg/eye.svg', 
    label: 'Edited the Deal Objectives',
    detailsFn: () => '',
  },
  'open-asset': {
    icon: '/svg/eye.svg',
    label: 'Opened Asset',
    detailsFn: (activityData) => activityData?.title,
  },
  'click-share': { 
    icon: '/svg/eye.svg', 
    label: 'Clicked the Share Button',
    detailsFn: () => '',
  },
  'hold-deal': {
    icon: '/svg/eye.svg',
    label: 'Put the Deal on Hold',
    detailsFn: () => '',
  },
  'reactivate-deal': { 
    icon: '/svg/eye.svg', 
    label: 'Reactivated the Deal',
    detailsFn: () => '',
  },
  'invite-user': {
    icon: '/svg/eye.svg',
    label: 'Invited User',
    detailsFn: (activityData) => activityData?.user,
  },
  'edit-user': {
    icon: '/svg/eye.svg',
    label: 'Edited User',
    detailsFn: (activityData) => activityData?.user,
  },
  'remove-user': {
    icon: '/svg/eye.svg',
    label: 'Removed User',
    detailsFn: (activityData) => activityData?.user,
  },
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-4;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }

  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }
}
</style>
