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
    getPainPointsCached: (state) => async (buyersphereId) => {
      await state.fetchPainPoints({ buyersphereId })
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
      await apiFetch(`/v0.1/pain-points/${painPoint.id}`, {
        method: 'DELETE'
      })

      remove(this.painPoints.content, pp => pp.id === painPoint.id)
    },
    async fetchPainPoints({ buyersphereId, forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      const url = buyersphereId
        ? `/v0.1/pain-points/${buyersphereId}`
        : '/v0.1/pain-points'

      if (!this.painPoints.content
          || forceRefresh
          || is10MinutesOld(this.painPoints.generatedAt)) {
        const { data } = await apiFetch(url)
        this.painPoints = {
          content: data.value,
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
