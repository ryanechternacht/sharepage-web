<template>
  <div class="border border-gray-200 rounded-md py-.5 px-2 flex flex-row gap-2 items-center bg-white">
    <div class="rounded-full w-2 h-2"
      :class="{'bg-blue-500': status === 'Engaged',
               'bg-green-300': status === 'Active',
               'bg-orange-300': status === 'On Hold',
               'bg-red-400': status === 'Inactive'}" />
    <div class="subtext">{{ status }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  lastActivityDate: { type: String },
  isOnHold: { type: Boolean, default: false },
})

const dayjs = useDayjs()
const status = computed(() => {
  if (props.isOnHold) {
    return 'On Hold'
  } else if (!props.lastActivityDate) {
    return 'Inactive'
  } else {
    const date = dayjs(props.lastActivityDate)
    const todayDayJs = dayjs(new Date().setHours(0,0,0,0))

    if (todayDayJs.diff(date, 'days') <= 7) {
      return 'Engaged'
    } else {
      return 'Active'
    }
  }
})
</script>

<style lang="postcss" scoped>
.small-text {
  font-size: .625rem;
}
</style>
