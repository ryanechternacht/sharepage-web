<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <h3 class="mt-3 mb-3">{{ organization.name }}</h3>
    <div class="flex flex-col gap-4">
      <div v-for="p in sellerUsers"
        class="item-list-row">
        <UserAvatar :user="p" />
        <h3 class="">{{ p.firstName }} {{ p.lastName }}</h3>
        <div class="flex-grow">{{ p.displayRole }}</div>
      </div>
    </div>
    <h3 class="mt-5 mb-3">{{ buyersphere.buyer }}</h3>
    <div class="flex flex-col gap-4">
      <div v-for="p in buyerUsers"
        class="item-list-row">
        <UserAvatar :user="p" />
        <h3 class="">{{ p.firstName }} {{ p.lastName }}</h3>
        <div class="flex-grow">{{ p.displayRole }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [buyersphere, organization] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value()
])

const props = defineProps({
  users: {type: Array, required: true},
  header: { type: String, required: true} 
})

const buyerUsers = computed(() => 
  orderBy(
    filter(props.users, u => u.team === 'buyer'),
    ['lastName', 'firstName'],
    ['asc', 'asc']
  )
)

const sellerUsers = computed(() => 
  orderBy(
    filter(props.users, u => u.team === 'seller'),
    ['lastName', 'firstName'],
    ['asc', 'asc']
  )
)
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>