<template>
  <div>
    <div class="sticky">
      <div class="flex flex-row items-center p-8 h-12 justify-between">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img src="/logo.svg">
          <h3>Buyersphere</h3>
        </NuxtLink>
        <div class="flex flex-row items-center gap-x-2">
          <span>{{ user.name || user.email }}</span>
          👤
        </div>
      </div>
    </div>

    <div class="text-center">
      <h1>Show me 
        <select v-model="owner" class="big-select bg-green">
          <option :value="null">Anyone's</option>
          <option :value="user.id">My</option>
          <option v-for="u in usersExceptMe" :value="u.id">
            {{ u.firstName }} {{ u.lastName }}'s
          </option>
        </select>
        <select v-model="status" class="big-select bg-blue">
          <option>Active</option>
          <option>Not Active</option>
          <option>On Hold</option>
          <option>Opt Out</option>
        </select>
        Opportunities in
        <select v-model="stage" class="big-select bg-purple">
          <option :value="null">All Opportunities</option>
          <option>Qualification</option>
          <option>Evaluation</option>
          <option>Decision</option>
        </select>
        Stage
      </h1>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, sortBy } = lodash_pkg;

const usersStore = useUsersStore()
const { getMeCached, getUsersCached } = storeToRefs(usersStore)

const [user, users] = await Promise.all([
  getMeCached.value(),
  getUsersCached.value()
])

const usersExceptMe = ref(
  sortBy(
    filter(users, u => u.id !== user.id),
    ['firstName']  
  )
)

const status = ref('Active')
const stage = ref(null)
const owner = ref(null)
</script>

<style lang="postcss" scoped>
.big-select {
  @apply inline mx-1 h1;
}
</style>