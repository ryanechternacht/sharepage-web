import { defineStore } from 'pinia'

// Unlike most caches, this dosn't use a time based refresh (because
// this data changes so infrequently). It can still be force 
// refreshed if necessary 

export const useUserStore = defineStore('user', {
  state: () => ({ user: null }),
  getters: {
    getUserCached: (state) => async () => {
      await state.fetchUser()
      return state.user
    },
  },
  actions: {
    async fetchUser({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()

      if (!this.user || forceRefresh) {
        const { data, error } = await apiFetch(`/v0.1/users/me`)
        this.user = data
      }
    },
  }
})
