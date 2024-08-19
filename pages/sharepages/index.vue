<template>
  <div class="w-full flex flex-row justify-end gap-2">
    <UInput v-model="searchTerm"
      icon="i-heroicons-magnifying-glass"
      class="my-2"
      placeholder="Account or Owner" />
  </div>
  <UTable :rows :columns @select="goToSharepage">
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

    <template #empty-state>
      <div class="flex flex-col items-center justify-center py-6 gap-3">
        <span class="italic subtext">No sharepages yet!</span>
        <UButton label="Create a Sharepage" 
          @click="openModal" />
      </div>
    </template>
  </UTable>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { chain } = lodash_pkg;
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'
import AddSharepageModal from '@/components/Modals/AddSharepageModal'

const sharepageStore = useSharepagesStore()
const { getSharepageList } = storeToRefs(sharepageStore)

const sharepages = await getSharepageList.value()

const { makeInternalSharepageLink } = useSharepageLinks()

const searchTerm = ref('')

function getNameLowerCase(owner) {
  return (owner?.firstName + ' ' + owner?.lastName).toLowerCase()
}

const rows = computed(() => 
  chain(sharepages)
    .filter(s => s.status !== 'archived' && s.roomType === 'deal-room')
    .filter(s => !searchTerm.value 
      || s.buyer.toLowerCase().includes(searchTerm.value.toLowerCase())
      || (s.owner && getNameLowerCase(s.owner).includes(searchTerm.value.toLowerCase()))
    )
    .orderBy(['updatedAt'], ['desc'])
    .value()
)

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

async function goToSharepage (e) {
  await navigateTo(makeInternalSharepageLink(e))
}

// TODO add in pagination?
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
  sort (ownerA, ownerB, direction) {
    if (!ownerA) {
      return 1
    } else if (!ownerB) {
      return -1
    }

    return getNameLowerCase(ownerA).localeCompare(getNameLowerCase(ownerB))
      * (direction === 'asc' ? 1 : -1)
  }
}, {
  label: 'Status',
  key: 'mostRecentBuyerActivity',
}, {
  label: 'Modified',
  key: 'updatedAt',
  sortable: true,
}]

const modal = useModal()
function openModal () {
  modal.open(AddSharepageModal, {
    async onClose (props) {
      modal.close()
      if (props?.sharepageId) {
        await navigateTo(`/${props.sharepageId}`)
      }
    }
  })
}
</script>

<style lang="postcss" scoped>
</style>
