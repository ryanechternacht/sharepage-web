<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="u in users"
        class="item-list-row">
        <UserAvatar :user="u" />
        <h3 class="min-w-[10rem]">{{ u.firstName }} {{ u.lastName }}</h3>
        <div class="flex-grow">{{ u.displayRole }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  users: {type: Array, required: true},
  header: { type: String, required: true} 
})
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