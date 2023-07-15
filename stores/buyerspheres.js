import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash';

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useBuyerspheresStore = defineStore('buyerspheres', {
  state: () => ({ buyerspheres: {} }),
  getters: {
    getBuyersphereByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphere({ buyersphereId })
      return state.buyerspheres[buyersphereId]?.content
    }
  },
  actions: {
    save(buyersphere) {
      // TODO call out to a backend
      throw "not implemented!"
      // this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    },
    async savefeaturesAnswer({ buyersphereId, featuresAnswer }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/features`,
        { method: 'PATCH', body: featuresAnswer }
      )
      this.buyerspheres[buyersphereId].featuresAnswer = data
    },
    async fetchBuyersphere({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerspheres[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerspheres[buyersphereId]?.generatedAt))
        {
          const { data } = await apiFetch(
            `/v0.1/buyerspheres/${buyersphereId}`
            )
          this.buyerspheres[buyersphereId] = {
            content: data,
            generatedAt: dayjs().toJSON()
          }
        }
    }
  }
})
