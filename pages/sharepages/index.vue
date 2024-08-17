<template>
  <div>
    <UTable :rows="activeSharepages" :columns @select="goToSharepage">
      <template #buyer-data="{ row }">
        <div class="flex flex-row items-center gap-2">
          <Logo :src="row.buyerLogo" class="icon-menu" />
          {{ row.buyer }}
        </div>
      </template>
      <template #owner-data="{ row }">
        <div v-if="row.owner"
          class="flex flex-row items-center gap-2">
          <UserAvatar :user="row.owner" />
          {{ row.owner?.firstName }} {{ row.owner?.lastName }} 
        </div>
      </template>
      <template #mostRecentBuyerActivity-data="{ row }">
        <SharepageStatusTag
          :last-activity-date="row.mostRecentBuyerActivity"
          :isOnHold="row.status === 'on-hold'" />
      </template>

      <template #updatedAt-data="{ row }">
        {{ prettyFormatDate(row.updatedAt )}}
      </template>
    </UTable>

    <!-- <div class="sharepages">
      <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Context</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Priority</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Status</h2>
      <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

      <NuxtLink class="contents cursor-pointer group" v-for="sharepage in activeSharepages"
        :to="makeInternalSharepageLink(sharepage)">
        <div class="cell body">
          <Logo :src="sharepage.buyerLogo" class="icon-menu" />
          {{ sharepage.buyer }}
        </div>
        <div class="cell subtext">{{ sharepage.subname }}</div>
        <div class="cell subtext">
          <template v-if="sharepage.owner">
            <UserAvatar :user="sharepage.owner" />
            {{ sharepage.owner?.firstName }} {{ sharepage.owner?.lastName }} 
          </template>
        </div>
        <div class="cell">
          <SharepagePriorityTag :priority="sharepage.priority" />
        </div>
        <div class="cell">
          <SharepageStatusTag
            :last-activity-date="sharepage.mostRecentBuyerActivity"
            :isOnHold="sharepage.status === 'on-hold'" />
        </div>
        <div class="cell subtext">{{ prettyFormatDate(sharepage.updatedAt )}}</div>
      </NuxtLink>
    </div> -->
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

const activeSharepages = computed(() => 
  orderBy(
    filter(sharepages,
      s => s.status !== 'archived' && s.roomType === 'deal-room'),
    ['updatedAt'],
    ['desc']
  )
)

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

const columns = [{
  label: 'Name',
  key: 'buyer',
  sortable: true,
}, {
  label: 'Context',
  key: 'subname',
}, {
  label: 'Owned By',
  key: 'owner',
  sortable: true,
}, {
  label: 'Status',
  key: 'mostRecentBuyerActivity',
}, {
  label: 'Modified',
  key: 'updatedAt',
  sortable: true,
  // direction: 'desc',
}]

async function goToSharepage (e) {
  await navigateTo(makeInternalSharepageLink(e))
}
</script>

<style lang="postcss" scoped>
.sharepages {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  grid-template-columns: repeat(6, 1fr);
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
