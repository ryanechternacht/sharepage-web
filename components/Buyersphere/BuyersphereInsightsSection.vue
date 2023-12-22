<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ items.length === 1 ? '1 insight' : `${items.length} insights`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="item in items"
        class="item-list-row"
        @click="emit('update:item', { item })">
        <img :src="activityMap[item.activity]?.icon"
          class="w-[1rem] h-[1rem]">
        <div>{{ activityMap[item.activity]?.label }}</div>
        
        <div class="flex-grow" />

        <UserAvatar :user="item.user" />
        <div class="ml-[-.5rem] min-w-[8rem]">{{ item.user.firstName}} {{ item.user.lastName }}</div>

        <template v-if="showAccount">
          <Logo :src="item.buyersphere.buyerLogo" />
          <div class="ml-[-.5rem] min-w-[8rem]">{{ item.buyersphere.buyer }}</div>
        </template>

        <div class="tag min-w-[3rem]">
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
  'site-activity': { icon: '/svg/eye.svg', label: 'Opened the Buyersphere' }
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-4;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>
