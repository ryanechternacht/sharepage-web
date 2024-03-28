<template>
   <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md w-[400px]"
  >
    <div flex flex-col>
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Your Team</h3>
        <BsButton @click="emit('close')">Close</BsButton>
      </div>
      <div class="flex flex-col gap-y-2">
        <div v-for="u in users"
          class="flex flex-row justify-between items-center hover:bg-gray-hover p-1 rounded-md">
          <PersonRow :person="u" class="flex-grow" />
          <div>
            <BsButton v-if="!isInBuyersphere(u)"
              @click="addToDeal(u)">Invite to Deal</BsButton>
            <div v-else class="tag gray italic">In Deal</div>
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useUsersStore } from '@/stores/users'
import { useSwaypagesStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { find } = lodash_pkg;

const { buyersphereId } = defineProps({
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const buyersphereStore = useSwaypagesStore()
const { getSwaypageByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { getUsersCached } = storeToRefs(usersStore)

const [buyersphere, users] = await Promise.all([
  getSwaypageByIdCached.value(buyersphereId),
  getUsersCached.value()
])

function isInBuyersphere (user) {
  return find(buyersphere.sellerTeam, p => p.id === user.id)
}

async function addToDeal (user) {
  await buyersphereStore.addSellerUser({ buyersphereId, user }) 
}
</script>

<style lang="postcss" scoped>
</style>
