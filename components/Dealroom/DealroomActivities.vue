<template>
  <div class="flex flex-col gap-4">
    <div 
      v-for="bucket in activityBuckets"
      class="flex flex-col gap-2"
    >
      <h5>{{ colloquializeDate(bucket[0].when) }}</h5>
      <div 
        v-for="activity in bucket"
        class="activity"
      >
        <img src="/svg/bell.svg">
        <div clas="gray">{{ activity.description }}</div>
        <div />
        <div class="gray-italic">{{ activity.user }} from {{ activity.userOrg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { groupBy } = lodash_pkg;
const dayjs = useDayjs()

const activities = [{
  description: 'Update made to JVP',
  user: 'Rebekah Black',
  userOrg: 'Gong',
  when: new Date(2023, 5, 13)
}, {
  description: 'Update made to JVP',
  user: 'Walter White',
  userOrg: 'Bank of America',
  when: new Date(2023, 5, 12)
}, {
  description: 'Update made to JVP',
  user: 'Rebekah Black',
  userOrg: 'Gong',
  when: new Date(2023, 5, 10)
}, {
  description: 'Update made to JVP',
  user: 'Rebekah Black',
  userOrg: 'Gong',
  when: new Date(2023, 5, 10)
}]

const activityBuckets = groupBy(activities, a => a.when)

// TODO put this somewhere better
function colloquializeDate (d) {
  const now = new Date()
  const today = dayjs(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
  const yesterday = today.subtract(1, 'days')
  const aWeekAgo = today.subtract(7, 'days')
  const date = dayjs(d)

  if (date.isSameOrAfter(today)) {
    return 'Today'
  } else if (date.isSameOrAfter(yesterday)) {
    return 'Yesterday'
  } else if (date.isSameOrAfter(aWeekAgo)) {
    return {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }[d.getDay()]
  } else {
    return date.format('MM/DD/YYYY')
  }
}
</script>

<style lang="postcss" scoped>
.activity {
  @apply grid gap-x-2 gap-y-0.5;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}
</style>