<template>
  <div class="section">
    <div class="group-header">{{ header }}</div>
    <div class="item-count">
      {{ assets.length === 1 ? '1 asset' : `${assets.length} assets`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <a v-for="asset in assets"
        :href="isTemplate ? null : asset.link"
        target="_blank"
        class="item-list-row"
        :class="{'hover:cursor-pointer': !isTemplate}"
        @click="clickActivity(asset)">
        
        <img src="/svg/book.svg" class="w-[1rem] h-[1rem]">
        <div>{{ asset.title }}</div>
        
        <div class="flex-grow h-[2rem]" />
        
        <Tag color="gray">
          {{ formatdate(asset.createdAt) }}
        </Tag>

        <DeleteButton v-if="isSeller" 
          class="show-on-row-hover"
          @click.prevent="emit('delete:asset', { asset })" />
        <EditButton v-if="isSeller" 
          class="show-on-row-hover"
          @click.prevent="emit('update:asset', { asset })" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { useBuyerActivityStore } from '~/stores/buyer-activity';
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'

const buyerActivityStore = useBuyerActivityStore()

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

function clickActivity(asset) {
  buyerActivityStore.captureBuyerActivity({ 
    activity: "open-asset",
    activityData: { title: asset.title, id: asset.id }
  })
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
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