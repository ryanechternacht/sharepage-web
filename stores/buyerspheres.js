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
    conversations: {},
    buyerActivity: {},
    pages: {},
  }),
  getters: {
    getBuyersphereByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphere({ buyersphereId })
      return state.buyerspheres[buyersphereId]?.content
    },
    getBuyersphereConversationsByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphereConversations({ buyersphereId })
      return state.conversations[buyersphereId]?.content
    },
    getBuyersphereBuyerActivityByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyersphereBuyerActivity({ buyersphereId })
      return state.buyerActivity[buyersphereId]?.content
    },
    getBuyerspherePagesByIdCached: (state) => async (buyersphereId) => {
      await state.fetchBuyerspherePages({ buyersphereId })
      return state.pages[buyersphereId]?.content
    },
  },
  actions: {
    async createBuyersphere({ buyer, subname, buyerLogo, crmOpportunityId, dealAmount }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres`,
        { method: 'POST', body: { buyer, subname, buyerLogo, crmOpportunityId, dealAmount } }
      )
    },
    async saveBuyersphereSettings({ buyersphereId, buyer, subname, buyerLogo, dealAmount, crmOpportunityId, 
      currentStage, showPricing,  qualificationDate, evaluationDate, decisionDate, status, isPublic }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { 
          buyer,
          subname, 
          buyerLogo,
          dealAmount,
          crmOpportunityId,
          currentStage,
          showPricing,
          qualificationDate,
          evaluationDate,
          decisionDate,
          status,
          isPublic,
        } 
      })

      const b = this.buyerspheres[buyersphereId].content
      b.currentStage = data.value.currentStage
      b.buyer = data.value.buyer
      b.subname = data.value.subname
      b.buyerLogo = data.value.buyerLogo
      b.showPricing = data.value.showPricing
      b.qualificationDate = data.value.qualificationDate
      b.evaluationDate = data.value.evaluationDate
      b.decisionDate = data.value.decisionDate
      b.dealAmount = data.value.dealAmount
      b.crmOpportunityId = data.value.crmOpportunityId
      b.status = data.value.status
      b.isPublic = data.value.isPublic
    },
    async updateBuyerInput({ buyersphereId, featuresAnswer, successCriteriaAnswer,
      objectivesAnswer, constraintsAnswer, pricingTierId, status }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { 
          method: 'PATCH', 
          body: { 
            featuresAnswer,
            successCriteriaAnswer,
            objectivesAnswer,
            constraintsAnswer,
            pricingTierId,
            status,
          } 
        }
      )
      const b = this.buyerspheres[buyersphereId].content
      if (data.value.featuresAnswer !== undefined) {
        b.featuresAnswer = data.value.featuresAnswer
      }
      if (data.value.successCriteriaAnswer !== undefined) {
        b.successCriteriaAnswer = data.value.successCriteriaAnswer
      }
      if (data.value.objectivesAnswer !== undefined) {
        b.objectivesAnswer = data.value.objectivesAnswer
      }
      if (data.value.constraintsAnswer !== undefined) {
        b.constraintsAnswer = data.value.constraintsAnswer
      }
      if (data.value.pricingTierId !== undefined) {
        b.pricingTierId = data.value.pricingTierId
      }
      if (data.value.status !== undefined) {
        b.status = data.value.status
      }
    },
    async advanceStage({ buyersphereId, stage }) {
      const body = { currentStage: stage }
      if (stage === "evaluation") {
        body.qualifiedOn = new Date().toISOString()
      } else if (stage === "decision") {
        body.evaluatedOn = new Date().toISOString()
      } else if (stage === "adoption") {
        body.decidedOn = new Date().toISOString()
      }

      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body }
      )
      
      const b = this.buyerspheres[buyersphereId].content
      b.currentStage = data.value.currentStage

      if (data.value.qualifiedOn !== undefined) {
        b.qualifiedOn = data.value.qualifiedOn
      }
      if (data.value.evaluatedOn !== undefined) {
        b.evaluatedOn = data.value.evaluatedOn
      }
      if (data.value.decidedOn !== undefined) {
        b.decidedOn = data.value.decidedOn
      }
      if (data.value.adoptedOn !== undefined) {
        b.adoptedOn = data.value.adoptedOn
      }
    },
    async savePricingCanPay({ buyersphereId, pricingCanPay }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { pricingCanPay } }
      )
      this.buyerspheres[buyersphereId].content.pricingCanPay = data.value.pricingCanPay
    },
    async saveIntroMessage({ buyersphereId, introMessage }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}`,
        { method: 'PATCH', body: { introMessage }}
      )
      
      this.buyerspheres[buyersphereId].content.introMessage = data.value.introMessage
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
          content: data.value,
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
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async fetchBuyersphereBuyerActivity({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerActivity[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerActivity[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${buyersphereId}/buyer-activity`)
        this.buyerActivity[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async startConversation({ buyersphereId, message, dueDate, assignedTo, assignedTeam, collaborationType }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations`,
        { method: 'POST', body: {message, dueDate, assignedTo, assignedTeam, collaborationType} }
      )
      this.conversations[buyersphereId].content.push(data.value)
    },
    async updateConversation({ buyersphereId, conversationId, resolved, dueDate,
                               message, assignedTo, assignedTeam, collaborationType }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations/${conversationId}`,
        { method: 'PATCH', body: { resolved, dueDate, message, assignedTo, assignedTeam, collaborationType }}
      )
      const c = find(this.conversations[buyersphereId]?.content, c => c.id === conversationId)
      if (c) {
        if (data.value.resolved !== undefined) {
          c.resolved = data.value.resolved
        }
        if (data.value.dueDate !== undefined) {
          c.dueDate = data.value.dueDate
        }
        if (data.value.message !== undefined) {
          c.message = data.value.message
        }
        if (data.value.assignedTo !== undefined) {
          c.assignedTo = data.value.assignedTo
        }
        if (data.value.assignedTeam !== undefined) {
          c.assignedTeam = data.value.assignedTeam
        }
        if (data.value.collaborationType !== undefined) {
          c.collaborationType = data.value.collaborationType
        }
      }
    },
    async deleteConversation({ buyersphereId, conversationId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations/${conversationId}`,
        { method: 'DELETE' }
      )

      remove(this.conversations[buyersphereId].content, c => c.id === conversationId)
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
      await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/resources/${resourceId}`,
        { method: 'DELETE' }
      )

      remove(this.buyerspheres[buyersphereId].content.resources, r => r.id === resourceId)
    },
    async createNote({ buyersphereId, title, body, authorId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/notes`,
        { method: 'POST', body: { title, body, authorId } }
      )
      this.buyerspheres[buyersphereId].content.notes.push(data.value)
    },
    async updateNote({ buyersphereId, noteId, title, body }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/notes/${noteId}`,
        { method: 'PATCH', body: { title, body }}
      )
      
      const ni = findIndex(
        this.buyerspheres[buyersphereId].content.notes, 
        n => n.id === noteId)
      this.buyerspheres[buyersphereId].content.notes[ni] = data.value
    },
    async deleteNote({ buyersphereId, noteId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/notes/${noteId}`,
        { method: 'DELETE' }
      )

      remove(this.buyerspheres[buyersphereId].content.notes, n => n.id === noteId)
    },
    async createBuyerUser({ buyersphereId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/teams/buyer`,
        { method: 'POST', body: user }
      )
      
      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async editBuyerUser({ buyersphereId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/teams/buyer/${user.id}`,
        { method: 'PATCH', body: user }
      )
      
      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async removeBuyerUser({ buyersphereId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/teams/buyer/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async addSellerUser({ buyersphereId, user}) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/teams/seller`,
        { method: 'POST', body: { user_id: user.id } }
      )
      
      this.buyerspheres[buyersphereId].content.sellerTeam = data.value
    },
    async removeSellerUser({ buyersphereId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/teams/seller/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[buyersphereId].content.sellerTeam = data.value
    },
    async fetchBuyerspherePages({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.pages[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.pages[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${buyersphereId}/pages`)
        this.pages[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createPage({ buyersphereId, page }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/pages`,
        { method: 'POST', body: page }
      )
      this.pages[buyersphereId].content.push(data.value)
      return data.value.id
    },
    async updatePage({ buyersphereId, pageId, page }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/page/${pageId}`,
        { method: 'PATCH', body: page }
      )
      
      const pi = findIndex(
        this.pages[buyersphereId].content, 
        p => p.id === pageId)
      this.pages[buyersphereId].content[pi] = data.value
    },
    async deleteResource({ buyersphereId, pageId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/page/${pageId}`,
        { method: 'DELETE' }
      )

      remove(this.pages[buyersphereId].content, p => p.id === pageId)
    },
  },
})
