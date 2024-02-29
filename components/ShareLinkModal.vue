<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Share this Sway Page</h3>
      </div>
      <div class="w-full mb-2">
        <h3>What's the name of the person you'd like to share this with?</h3>
        <input v-model="name"
          class="w-full"
          placeholder="Enter their name">
      </div>
      <CopyToClipboardButton
        class="mx-auto"
        color="blue"
        hover-color="blue"
        :buyersphere-id="buyersphereId"
        :name="name" />

      <div v-if="!isBuyerspherePublic" class="mt-8">
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