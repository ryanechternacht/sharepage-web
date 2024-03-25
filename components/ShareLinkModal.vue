<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="modal-grid">
      <div class="col-span-2 flex flex-row items-center mb-3">
        <h3 class="flex-grow">Share this Sway Page</h3>
        <BsButton @click="emit('close')">Close</BsButton>
      </div>

      <div class="flex flex-col">
        <h3>Send a General Link</h3>
        <CopyToClipboardButton
          class="w-[8rem] mt-4"
          color="blue"
          hover-color="blue"
          :buyersphere-id="buyersphereId" />
      </div>
      <div>
        <h3>Send a Personalized Link</h3>
        <input v-model="name"
          class="w-full mt-2"
          placeholder="Enter their name">
        <CopyToClipboardButton
          class=" w-[8rem] mt-4"
          color="blue"
          hover-color="blue"
          :buyersphere-id="buyersphereId"
          :recipient="name" />
      </div>

      <div v-if="!isBuyerspherePublic" class="mt-8 col-span-2">
        <div class="italic tag">
          NOTE: Because this Swaypage isn't publicly viewable, it can only be 
          viewed users with a login.
        </div>
        <NuxtLink :to="makeBuyersphereLink(buyersphere, 'team')" 
          class="block mt-2"
          @click="emit('close')">
          <div class="italic tag underline">Invite Users to this Swaypage</div>
        </NuxtLink>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'

const props = defineProps({
  buyersphereId: { type: Number, required: true },
  isBuyerspherePublic: { type: Boolean, default: true }
})

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const buyersphere = await getBuyersphereByIdCached.value(props.buyersphereId)

const emit = defineEmits(['close'])

const name = ref(props.linkedName)

const { makeBuyersphereLink } = useBuyersphereLinks()
</script>

<style lang="postcss" scoped>
.modal-grid {
  @apply grid gap-y-2 gap-x-8 w-[36rem];
  grid-template-columns: repeat(2, 1fr);

  /* flex flex-col w-[36rem] gap-2 */
}
</style>