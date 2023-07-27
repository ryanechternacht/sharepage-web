import { defineStore } from 'pinia'

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const usePainPointsStore = defineStore('pain-points', {
  state: () => ({ painPoints: {} }),
  getters: {
    // Use this to fetch if needed and return the data. This 
    // is normally what you want to use
    getPainPointsCached: (state) => async () => {
      await state.fetchPainPoints()
      return state.painPoints.content
    },
    get: (state) => state.painPoints.content
  },
  actions: {
    async createPainPoint({ painPoint }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch("/v0.1/pain-points", {
        method: 'POST',
        body: painPoint
      })

      this.painPoints.content.push(data.value)
    },
    async fetchPainPoints({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.painPoints.content
          || forceRefresh
          || is10MinutesOld(this.painPoints.generatedAt)) {
        const { data } = await apiFetch(`/v0.1/pain-points`)
        this.painPoints = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    }
  }
})
