<template>
  <div class="flex flex-col gap-y-4">
    <SetupItem
      v-for="(item, i) in items"
      :item="item"
      :index="i"
      :feature-mode="featureMode"
      @update-item="updateItem"
      @delete-item="deleteItem">
      <template #editing="{ item, updateItem }">
        <slot name="editing" :item="item" :update-item="updateItem" />
      </template>
      <template #display="{ index, item }">
        <slot name="display" :item="item" :index="index" />
      </template>
    </SetupItem>
  </div>
</template>

<script setup>
// "feature-mode" is the differential rendering for the features version
const props = defineProps({ 
  items: Array, 
  featureMode: { type: Boolean, default: false} 
})
const emit = defineEmits(['updateItem', 'deleteItem'])

function updateItem ({ item }) {
  emit('updateItem', { item })
}

function deleteItem ({ item }) {
  emit('deleteItem', { item })
}
</script>

<style lang="postcss" scoped>
.items-grid {
  @apply grid gap-x-2 gap-y-2;
  grid-template-columns: 1fr auto auto;
  img {
    @apply cursor-pointer;
  }
}
</style>
