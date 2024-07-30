<template>
  <div class="templates">
    <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
    <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
    <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

    <NuxtLink class="contents cursor-pointer group" v-for="sharepage in templateRooms"
      :to="makeInternalSharepageLink(sharepage)">
      <div class="cell body">
        <UIcon v-if="sharepage.isLocked"
          name="i-heroicons-lock-closed"/>
        {{ sharepage.buyer }}</div>
      <div class="cell subtext">
        <template v-if="sharepage.owner">
          <UserAvatar :user="sharepage.owner" />
          {{ sharepage.owner?.firstName }} {{ sharepage.owner?.lastName }} 
        </template>
      </div>
      <div class="cell subtext">{{ prettyFormatDate(sharepage.updatedAt )}}</div>
    </NuxtLink>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'

const sharepageStore = useSharepagesStore()
const { getSharepageList } = storeToRefs(sharepageStore)

const sharepages = await getSharepageList.value()

const { makeInternalSharepageLink } = useSharepageLinks()

const templateRooms = computed(() => 
  orderBy(
    filter(sharepages,
      s => s.status !== 'archived' && s.roomType === 'template'),
    ['updatedAt'],
    ['desc']
  )
)

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>
.templates {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  grid-template-columns: repeat(3, 1fr);
}

.cell {
  @apply py-2 relative flex flex-row items-center gap-2;

  &::after {
    @apply absolute bg-gray-200 h-[1px] w-screen;
    content: '';
    inset-inline-start: -5rem;
    inset-block-start: 0;
  }
}

.group:hover {
  .cell {
    @apply bg-gray-100 -mx-4 px-4
  }

  .cell:first-child {
    @apply -ml-8 pl-8
  }

  .cell:last-child {
    @apply -mr-8 pr-8
  }
}
</style>
