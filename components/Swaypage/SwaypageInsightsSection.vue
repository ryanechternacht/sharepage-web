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
        <Tag color="gray">{{ activityMap[item.activity]?.label }}</Tag>
        <div
          v-html="activityMap[item.activity]?.detailsFn(item.activityData)"
          class="main-content inline-html" />

        <!-- TODO anonymous shape? -->
        <div class="min-w-[9.5rem] flex flex-row items-center gap-2">
          <UserAvatar :user="item.user" :unknown="!item.user" />
          <div v-if="item.user">
            {{ item.user.firstName}} {{ item.user.lastName }}
          </div>
          <!-- <div v-else> -->
          <div v-else-if="item.anonymousUser.linkedName">
            {{ item.anonymousUser.linkedName }}
          </div>
            <!-- <div v-if="item.anonymousUser.linkedName && item.anonymousUser.enteredName != item.anonymousUser.linkedName">
              ({{ item.anonymousUser.linkedName }})
            </div>
          </div> -->
        </div>

        <template v-if="showAccount">
          <Logo :src="item.buyersphere.buyerLogo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ item.buyersphere.buyer }}</div>
        </template>

        <div class="tag min-w-[4rem]">
          {{ prettyFormatDateFromToday(item.createdAt || item.lastActivity) }}
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

// TODO these to use icons, not hardcoded svgs
const activityMap = {
  'site-activity': {
    icon: '/svg/eye.svg',
    label: 'Viewed Page',
    detailsFn: (activityData) => `In total, has spent ${activityData.numMinutes} minutes in the SwayPage, most recently: ${prettyFormatDateFromToday(activityData.lastActivity)}`,
  },
  'create-activity': {
    icon: '/svg/edit-2.svg',
    label: 'Created Activity',
    detailsFn: (activityData) => activityData?.title,
  },
  'edit-activity': {
    icon: '/svg/edit-2.svg',
    label: 'Edited Activity',
    detailsFn: (activityData) => activityData?.title,
  },
  'resolve-activity': {
    icon: '/svg/edit-2.svg',
    label: 'Resolved Activity',
    detailsFn: (activityData) => activityData?.title,
  },
  'unresolve-activity': {
    icon: '/svg/edit-2.svg',
    label: 'Re-opened Activity',
    detailsFn: (activityData) => activityData?.title,
  },
  'delete-activity': {
    icon: '/svg/edit-2.svg',
    label: 'Deleted Activity',
    detailsFn: (activityData) => activityData?.title,
  },
  'edit-constraints': {
    icon: '/svg/edit-2.svg',
    label: '',
    detailsFn: () => 'Edited the Deal Constraints'
  },
  'edit-success-criteria': {
    icon: '/svg/edit-2.svg',
    label: 'Edited the Deal Success Criteria',
    detailsFn: () => '',
  },
  'edit-features': {
    icon: '/svg/edit-2.svg',
    label: 'Edited the Deal Features',
    detailsFn: () => '',
  },
  'edit-objectives': { 
    icon: '/svg/edit-2.svg', 
    label: 'Edited the Deal Objectives',
    detailsFn: () => '',
  },
  'open-asset': {
    icon: '/svg/eye.svg',
    label: 'Opened Asset',
    detailsFn: (activityData) => activityData?.title,
  },
  'open-asset-v2': {
    icon: '/svg/eye.svg',
    label: 'Opened Asset',
    detailsFn: (activityData) => activityData?.link,
  },
  'click-share': { 
    icon: '/svg/eye.svg', 
    label: 'Clicked the Share Button',
    detailsFn: () => '',
  },
  'hold-deal': {
    icon: '/svg/edit-2.svg',
    label: 'Put the Deal on Hold',
    detailsFn: () => '',
  },
  'reactivate-deal': { 
    icon: '/svg/edit-2.svg', 
    label: 'Reactivated the Deal',
    detailsFn: () => '',
  },
  'invite-user': {
    icon: '/svg/edit-2.svg',
    label: 'Invited User',
    detailsFn: (activityData) => activityData?.user,
  },
  'accept-invite': {
    icon: '/svg/edit-2.svg',
    label: 'Invite Accepted',
    detailsFn: (activityData) => activityData?.user,
  },
  'edit-user': {
    icon: '/svg/edit-2.svg',
    label: 'Edited User',
    detailsFn: (activityData) => activityData?.user,
  },
  'remove-user': {
    icon: '/svg/edit-2.svg',
    label: 'Removed User',
    detailsFn: (activityData) => activityData?.user,
  },
  'edit-page': {
    icon: '/svg/edit-2.svg',
    label: 'Edited Page',
    detailsFn: (activityData) => activityData?.title
  },
  'create-milestone': {
    icon: '/svg/edit-2.svg',
    label: 'Created Milestone',
    detailsFn: (activityData) => activityData?.title
  },
  'edit-milestone': {
    icon: '/svg/edit-2.svg',
    label: 'Edited Milestone',
    detailsFn: (activityData) => activityData?.title
  },
  'delete-milestone': {
    icon: '/svg/edit-2.svg',
    label: 'Deleted Milestone',
    detailsFn: (activityData) => activityData?.title
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
