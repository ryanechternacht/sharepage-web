<template>
  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div id="profile"
      class="section">
      <div class="group-header">Profile</div>

      <div class="item-list mt-[2rem]">
        <div class="item-list-row"
          @click="open">
          <UserAvatar :user="user" />
          <h3>{{ user.firstName }} {{ user.lastName }}</h3>
          <div>{{ user.displayRole }}</div>
          <div class="flex-grow" />
          <!-- last active -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import AddEditUserModal from '@/components/AddEditUserModal'
import { useModal } from 'vue-final-modal'

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [user] = await Promise.all([
  getMeCached.value()
])

const { open, close } = useModal({
  component: AddEditUserModal,
  attrs: {
    user,
    onClose () {
      close()
    }
  }
})
</script>

<style lang="postcss" scoped>
.item-list {
  @apply flex flex-col gap-4;

  .item-list-row {
    @apply flex flex-row items-center gap-2;

    &:hover {
      @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
      width: calc(100% + 2rem);
    }
  }
}
</style>