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
    // save(buyersphere) {
    //   // TODO call out to a backend
    //   this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    // },
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
