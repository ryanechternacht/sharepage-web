<template>
  <div class="flex flex-col gap-y-2">
    <SetupItem
      v-for="item in items"
      :item="item"
      @update-item="updateItem"
      @delete-item="deleteItem" />
  </div>
</template>

<script setup>
const props = defineProps({ items: Array })
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
