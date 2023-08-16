import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove, findIndex } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useFeaturesStore = defineStore('features', {
  state: () => ({ features: {} }),
  getters: {
    getFeaturesCached: (state) => async () => {
      await state.fetchFeatures()
      return state.features.content
    }
  },
  actions: {
    async createFeature({ feature }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch("/v0.1/features", {
        method: "POST",
        body: feature
      })

      this.features.content.push(data.value)
    },
    async deleteFeature({ feature }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/features/${feature.id}`, {
        method: 'DELETE',
      })
  
      remove(this.features.content, f => f.id === feature.id)
    },
    async fetchFeatures({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()

      if (!this.features.content
          || forceRefresh
          || is10MinutesOld(this.features.generatedAt)) {
        const { data } = await apiFetch('/v0.1/features')
        this.features = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updateFeature({ feature }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/features/${feature.id}`, {
        method: 'PUT',
        body: feature
      })

      const i = findIndex(this.features.content, f => f.id === feature.id)
      this.features.content[i] = data.value
    }
  }
})
