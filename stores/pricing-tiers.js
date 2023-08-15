import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove, findIndex } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const usePricingTiersStore = defineStore('pricing-tiers', {
  state: () => ({ pricingTiers: {} }),
  getters: {
    // Use this to fetch if needed and return the data. This 
    // is normally what you want to use
    getPricingTiersCached: (state) => async () => {
      await state.fetchPricingTiers()
      return state.pricingTiers.content
    },
    get: (state) => state.pricingTiers.content
  },
  actions: {
    async createPricingTier({ pricingTier }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch("/v0.1/pricing-tiers", {
        method: 'POST',
        body: pricingTier
      })

      this.pricingTiers.content.push(data.value)
    },
    async deletePricingTier({ pricingTier }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/pricing-tiers/${pricingTier.id}`, {
        method: 'DELETE'
      })

      remove(this.pricingTiers.content, pt => pt.id === pricingTier.id)
    },
    async fetchPricingTiers({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.pricingTiers.content
          || forceRefresh
          || is10MinutesOld(this.pricingTiers.generatedAt)) {
        const { data } = await apiFetch(`/v0.1/pricing-tiers`)
        this.pricingTiers = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    }, 
    async updatePricingTier({ pricingTier }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/pricing-tiers/${pricingTier.id}`, {
        method: 'PUT',
        body: pricingTier
      })

      const i = findIndex(this.pricingTiers.content, pt => pt.id === pricingTier.id)
      this.pricingTiers.content[i] = data.value
    },
  }
})
