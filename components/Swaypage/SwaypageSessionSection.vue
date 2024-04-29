<template>
  <div class="section">
    <div class="group-header">Buyer Views</div>
    <div class="item-count">
      {{ items?.length === 1 ? '1 page view' : `${items?.length} page views`}}
    </div>

    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="item in items"
        class="item-list-row">
        <EyeIcon class="icon-menu" />
        <Tag color="gray">Swaypage View</Tag>
        <div
          v-html="reformatView(item)"
          class="main-content inline-html" />

        <!-- TODO anonymous shape? -->
        <div class="min-w-[9.5rem] flex flex-row items-center gap-2">
          <div>
            {{ item[0]?.anonymousUser?.linkedName }}
          </div>
        </div>

        <div class="tag min-w-[4rem]">
          {{ prettyFormatDateFromToday(item[0]?.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { join, map } = lodash_pkg;

const props = defineProps({ 
  items: { type: Array, required: true },
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

function reformatView (item) {
  return join(
    map(item.timings, i => `${i.title}: ${i.timeOnPage} seconds`),
    ' | '
  )
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
