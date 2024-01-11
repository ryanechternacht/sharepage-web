<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="user in users"
        class="item-list-row">
        <UserAvatar :user="user" />
        <h3 class="min-w-[10rem]">{{ user.firstName }} {{ user.lastName }}</h3>
        <div class="main-content">{{ user.displayRole }}</div>
        <DeleteButton v-if="canEdit" 
          class="show-on-row-hover"
          @click.prevent="emit('delete:user', { user })" />
        <EditButton v-if="canEdit" 
          class="show-on-row-hover"
          @click.prevent="emit('update:user', { user })" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  users: { type: Array, required: true },
  header: { type: String, required: true },
  canEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['update:user', 'delete:user'])
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-4;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }
  }

  * {
    @apply shrink-0;
  }

  .main-content {
    @apply shrink grow;
  }
}

.show-on-row-hover {
  @apply hidden;
}
</style>