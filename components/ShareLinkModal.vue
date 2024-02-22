<template>
  <VueFinalModal
    class="flex justify-center items-center"
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

      <div v-if="!isBuyerspherePublic" class="mt-8 italic tag">
        NOTE: this buyersphere isn't publicly viewable
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  buyersphereId: { type: String, required: true },
  isBuyerspherePublic: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const name = ref(props.linkedName)
</script>