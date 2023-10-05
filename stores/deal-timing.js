import { defineStore } from 'pinia'

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const useDealTimingStore = defineStore('deal-timing', {
  state: () => ({ dealTiming: {} }),
  getters: {
    // Use this to fetch if needed and return the data. This 
    // is normally what you want to use
    getDealTimingCached: (state) => async () => {
      await state.fetchDealTiming()
      return state.dealTiming.content
    },
    get: (state) => state.dealTiming.content
  },
  actions: {
    async fetchDealTiming({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.dealTiming.content
          || forceRefresh
          || is10MinutesOld(this.dealTiming.generatedAt)) {
        const { data } = await apiFetch('/v0.1/deal-timing')
        this.dealTiming = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    }, 
    async upsertDealTiming({ dealTiming }) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()
      const { data } = await apiFetch('/v0.1/deal-timing', {
        method: 'PUT',
        body: dealTiming
      })

      this.dealTiming = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
  }
})
