import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { findIndex } = lodash_pkg;

// Unlike most caches, `me` dosn't use a time based refresh (because
// this data changes so infrequently). It can still be force 
// refreshed if necessary 

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useUsersStore = defineStore('users', {
  state: () => ({ me: undefined, noUser: null, users: {} }),
  getters: {
    getMeCached: (state) => async () => {
      await state.fetchMe()
      return state.me
    },
    getUsersCached: (state) => async () => {
      await state.fetchUsers()
      return state.users.content
    },
    isUserLoggedIn: (state) => async () => {
      await state.fetchMe()
      return !!state.me
    },
    isUserSeller: (state) => async () => {
      await state.fetchMe()
      return state.me?.buyersphereRole === 'admin'
    },
  },
  actions: {
    async createUser({ user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch('/v0.1/users', {
        method: "POST",
        body: user
      })

      this.users.content.push(data.value)
    },
    async fetchMe({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()

      if (this.me === undefined || forceRefresh) {
        const { data } = await apiFetch('/v0.1/users/me')
        this.me = data.value
      }
    },
    async fetchUsers({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()

      if (!this.users.content
          || forceRefresh
          || is10MinutesOld(this.users.generatedAt)) {
        const { data } = await apiFetch('/v0.1/users')
        this.users = {
          content: data.value,
          generateAt: dayjs().toJSON()
        }
      }
    },
    async updateUser({ id, firstName, lastName, displayRole }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/users/${id}`, {
        method: "PATCH",
        body: {
          firstName,
          lastName,
          displayRole
        }
      })

      const i = findIndex(this.users.content, u => u.id === id)
      if (i >= 0) {
        this.users.content[i] = data.value
      }
      if (this.me.id === id) {
        this.me.firstName = data.value.firstName
        this.me.lastName = data.value.lastName
        this.me.displayRole = data.value.displayRole
      }
    },
  }
})
