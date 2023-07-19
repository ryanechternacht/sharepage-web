import { defineStore } from 'pinia'

// Unlike most caches, this dosn't use a time based refresh (because
// this data changes so infrequently). It can still be force 
// refreshed if necessary 

export const useOrganizationStore = defineStore('organization', {
  state: () => ({ organization: null }),
  getters: {
    getOrganizationCached: (state) => async () => {
      await state.fetchOrganization()
      return state.organization
    },
  },
  actions: {
    async fetchOrganization({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()

      if (!this.organization || forceRefresh) {
        const { data } = await apiFetch(`/v0.1/organization`)
        this.organization = data
      }
    },
  }
})

