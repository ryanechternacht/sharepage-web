import { defineStore } from 'pinia'

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useOrganizationStore = defineStore('organization', {
  state: () => ({ organization: {} }),
  getters: {
    getOrganizationCached: (state) => async () => {
      await state.fetchOrganization()
      return state.organization.content
    }
  },
  actions: {
    async fetchOrganization({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.organization.content
          || forceRefresh
          || is10MinutesOld(this.organization.generatedAt)) {
        const { data } = await apiFetch(
          `/v0.1/organization`
        )
        this.organization = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    }
  }
})

