<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/settings/personal`)">Personal</div>
      <div class="page-link"
        @click="navigateTo(`/settings/guide-template`)">Guide Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/timeline-template`)">Timeline Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/assets-template`)">Assets Template</div>
      <h3 class="page-link">Admin</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 class="in-page-link"
          @click="navigateTo('#team')">Team Members</h4>
      </div>
    </div>
  </div>

  <div class="[grid-area:center]" v-scroll-spy>
    <div id="team"
      class="section">
      <div class="group-header">Team Members</div>

      <div class="item-list mt-[2rem]">
        <div v-for="u in users"
          class="item-list-row"
          @click="editUser({ user: u })">
          <UserAvatar :user="u" />
          <h3>{{ u.firstName }} {{ u.lastName }}</h3>
          <div>{{ u.displayRole }}</div>
          <div class="flex-grow" />
          <!-- last active -->
        </div>
      </div>

      <div class="section-add-button">
        <BsButton @click="createUser">
          <img src="/svg/new-thing.svg" class="mr-2">
          <p>Add</p>
        </BsButton>
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
const { getUsersCached } = storeToRefs(usersStore)

const [users] = await Promise.all([
  getUsersCached.value()
])

const { open, close, patchOptions } = useModal({
  component: AddEditUserModal,
  attrs: {
    onClose () {
      close()
    }
  }
})

function editUser({ user }) {
  patchOptions({ attrs: { user }})
  open()
}

function createUser() {
  patchOptions({ attrs: { user: null }})
  open()
}
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