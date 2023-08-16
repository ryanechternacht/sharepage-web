import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove, findIndex } = lodash_pkg;

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
    async deletePainPoint({ painPoint }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/pain-points/${painPoint.id}`, {
        method: 'DELETE'
      })

      remove(this.painPoints.content, pp => pp.id === painPoint.id)
    },
    async fetchPainPoints({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.painPoints.content
          || forceRefresh
          || is10MinutesOld(this.painPoints.generatedAt)) {
        const { data } = await apiFetch('/v0.1/pain-points')
        this.painPoints = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    }, 
    async updatePainPoint({ painPoint }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/pain-points/${painPoint.id}`, {
        method: 'PUT',
        body: painPoint
      })

      const i = findIndex(this.painPoints.content, pp => pp.id === painPoint.id)
      this.painPoints.content[i] = data.value
    },
  }
})
