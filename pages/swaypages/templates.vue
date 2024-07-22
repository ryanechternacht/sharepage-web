<template>
  <div class="templates">
    <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
    <h2 class="h-[3rem] flex flex-row items-center">Owned By</h2>
    <h2 class="h-[3rem] flex flex-row items-center">Modified</h2>

    <NuxtLink class="contents cursor-pointer group" v-for="swaypage in templateRooms"
      :to="makeInternalSwaypageLink(swaypage)">
      <div class="cell body">
        <UIcon v-if="swaypage.isLocked"
          name="i-heroicons-lock-closed"/>
        {{ swaypage.buyer }}</div>
      <div class="cell subtext">
        <template v-if="swaypage.owner">
          <UserAvatar :user="swaypage.owner" />
          {{ swaypage.owner?.firstName }} {{ swaypage.owner?.lastName }} 
        </template>
      </div>
      <div class="cell subtext">{{ prettyFormatDate(swaypage.updatedAt )}}</div>
    </NuxtLink>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'

const swaypageStore = useSwaypagesStore()
const { getSwaypageList } = storeToRefs(swaypageStore)

const swaypages = await getSwaypageList.value()

const { makeInternalSwaypageLink } = useSwaypageLinks()

const templateRooms = computed(() => 
  orderBy(
    filter(swaypages,
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
