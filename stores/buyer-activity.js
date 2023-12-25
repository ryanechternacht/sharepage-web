import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useBuyerActivityStore = defineStore('buyer-activity', {
  state: () => ({ 
    buyerActivity: {},
  }),
  getters: {
    getBuyerActivityForOrganizationCached: (state) => async (buyersphereId) => {
      await state.fetchBuyerActivity()
      return state.buyerActivity?.content
    }
  },
  actions: {
    async fetchBuyerActivity({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerActivity.content
          || forceRefresh
          || is10MinutesOld(this.buyerActivity.generatedAt)) {
        const { data } = await apiFetch('/v0.1/buyer-activity')
        this.buyerActivity = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    }, 
  }
})