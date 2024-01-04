<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ assets.length === 1 ? '1 asset' : `${assets.length} assets`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <a v-for="asset in assets"
        :href="asset.link"
        target="_blank"
        class="item-list-row">
        
        <img src="/svg/book.svg" class="w-[1rem] h-[1rem]">
        <div>{{ asset.title }}</div>
        
        <div class="flex-grow h-[2rem]" />
        
        <Tag2 color="gray">
          {{ formatdate(asset.createdAt) }}
        </Tag2>

        <DeleteButton v-if="isSeller" 
          class="show-on-row-hover"
          @click.stop="emit('delete:asset', { asset })" />
        <EditButton v-if="isSeller" 
          class="show-on-row-hover"
          @click.stop="emit('update:asset', { asset })" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const [isSeller] = await Promise.all([
  isUserSeller.value(),
])

const props = defineProps({ 
  assets: { type: Array, required: true },
  header: { type: String, required: true },
  isTemplate: { type: Boolean, default: false }
})

const emit = defineEmits(['update:asset', 'delete:asset'])

const dayjs = useDayjs()
function formatdate (date) {
  return dayjs(date).format('MMM Do')
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }
  }
}

.show-on-row-hover {
  @apply hidden;
}
</style>