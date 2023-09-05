import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, findIndex, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useBuyerspheresStore = defineStore('buyerspheres', {
  state: () => ({ 
    buyerspheres: {}, 
    conversations: {}
  }),
  getters: {
    getBuyersphereByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphere({ buyersphereId })
      return state.buyerspheres[buyersphereId]?.content
    },
    getBuyersphereConversationsByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphereConversations({ buyersphereId })
      return state.conversations[buyersphereId]?.content
    }
  },
  actions: {
    async saveFeaturesAnswer({ buyersphereId, featuresAnswer }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { featuresAnswer } }
      )
      this.buyerspheres[buyersphereId].content.featuresAnswer = data.value
    },
    async saveStage({ buyersphereId, stage }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { currentStage: stage } }
      )
      this.buyerspheres[buyersphereId].content.currentStage = data.value.currentStage
    },
    async saveStatus({ buyersphereId, status }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { status } }
      )
      this.buyerspheres[buyersphereId].content.status = data.value.status
    },
    async savePricingCanPay({ buyersphereId, pricingCanPay }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { pricingCanPay } }
      )
      this.buyerspheres[buyersphereId].content.pricingCanPay = data.value.pricingCanPay
    },
    async savePricingTierId({ buyersphereId, pricingTierId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { pricingTierId } }
      )
      this.buyerspheres[buyersphereId].content.pricingTierId = data.value.pricingTierId
    },
    async fetchBuyersphere({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerspheres[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerspheres[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${buyersphereId}`)
        this.buyerspheres[buyersphereId] = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async fetchBuyersphereConversations({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.conversations[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.conversations[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${buyersphereId}/conversations`)
        this.conversations[buyersphereId] = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async startConversation({ buyersphereId, message }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations`,
        { method: 'POST', body: {message} }
      )
      this.conversations[buyersphereId].content.push(data.value)
    },
    async updateConversation({ buyersphereId, conversationId, resolved }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations/${conversationId}`,
        { method: 'PATCH', body: { resolved }}
      )
      const c = find(this.conversations[buyersphereId].content, c => c.id === conversationId)
      c.resolved = resolved
    },
    async createResource({ buyersphereId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/resources`,
        { method: 'POST', body: { title, link } }
      )
      this.buyerspheres[buyersphereId].content.resources.push(data.value)
    },
    async updateResource({ buyersphereId, resourceId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/resources/${resourceId}`,
        { method: 'PATCH', body: { title, link }}
      )
      
      const ri = findIndex(
        this.buyerspheres[buyersphereId].content.resources, 
        r => r.id === resourceId)
      this.buyerspheres[buyersphereId].content.resources[ri] = data.value
    },
    async deleteResource({ buyersphereId, resourceId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/resources/${resourceId}`,
        { method: 'DELETE' }
      )

      remove(this.buyerspheres[buyersphereId].content.resources, r => r.id === resourceId)
    }
  }
})
