import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, findIndex, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useSwaypagesStore = defineStore('swaypages', {
  state: () => ({ 
    buyerspheres: {},
    milestones: {},
    activities: {},
    buyerActivity: {},
    pages: {},
  }),
  getters: {
    getSwaypageByIdCached: (state) => async (buyersphereId) => {
      await state.fetchSwaypage({ buyersphereId })
      return state.buyerspheres[buyersphereId]?.content
    },
    getSwaypageMilestonesByIdCached: (state) => async (buyersphereId) => {
      await state.fetchSwaypageMilestones({ buyersphereId })
      return state.milestones[buyersphereId]?.content
    },
    getSwaypageActivitiesByIdCached: (state) => async (buyersphereId) => {
      await state.fetchSwaypageActivities({ buyersphereId })
      return state.activities[buyersphereId]?.content
    },
    getSwaypageBuyerActivityByIdCached: (state) => async (buyersphereId) => {
      await state.fetchSwaypageBuyerActivity({ buyersphereId })
      return state.buyerActivity[buyersphereId]?.content
    },
    getSwaypagePagesByIdCached: (state) => async (buyersphereId) => {
      await state.fetchSwaypagePages({ buyersphereId })
      return state.pages[buyersphereId]?.content
    },
  },
  actions: {
    async createSwaypage({ 
      buyer, subname, buyerLogo, crmOpportunityId, dealAmount,
      pageTemplateId, pageTitle 
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } =  await apiFetch(
        `/v0.1/buyerspheres`,
        { 
          method: 'POST', 
          body: { 
            buyer,
            subname,
            buyerLogo,
            crmOpportunityId,
            dealAmount,
            pageTemplateId,
            pageTitle,
          } 
        }
      )
      return data.value.id
    },
    async saveSwaypageSettings({
      buyersphereId, buyer, subname, buyerLogo, dealAmount, 
      crmOpportunityId, currentStage, showPricing,  qualificationDate, 
      evaluationDate, decisionDate, status, isPublic 
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}`,
        { 
          method: 'PATCH',
          body: { 
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
        }
      )

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
        `/v0.1/buyersphere/${buyersphereId}`,
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
      const b = this.buyerspheres && this.buyerspheres[buyersphereId]?.content
      if (!b) {
        return
      }
      
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
    async fetchSwaypage({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerspheres[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerspheres[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${buyersphereId}`)
        this.buyerspheres[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async fetchSwaypageMilestones({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.milestones[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.milestones[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${buyersphereId}/milestones`)
        this.milestones[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createSwaypageMilestone({ buyersphereId, milestone }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestones`,
        { method: 'POST', body: milestone }
      )
      this.milestones[buyersphereId].content.push(data.value)
    },
    async updateSwaypageMilestone({ buyersphereId, id, milestone }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestone/${id}`,
        { method: 'PATCH', body: milestone }
      )
      const m = find(this.milestones[buyersphereId]?.content, m => m.id === id)
      if (m) {
        if (data.value.title !== undefined) {
          m.title = data.value.title
        }
      }
    },
    async deleteSwaypageMilestone({ buyersphereId, id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestone/${id}`,
        { method: 'DELETE' }
      )

      remove(this.milestones[buyersphereId].content, m => m.id === id)
    },
    async fetchSwaypageActivities({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.activities[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.activities[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${buyersphereId}/milestones/activities`)
        this.activities[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createSwaypageActivity({ buyersphereId, milestoneId, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestone/${milestoneId}/activities`,
        { method: 'POST', body: activity }
      )
      this.activities[buyersphereId].content.push(data.value)
    },
    async deleteSwaypageActivity({ buyersphereId, id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/activity/${id}`,
        { method: 'DELETE' }
      )

      remove(this.activities[buyersphereId].content, a => a.id === id)
    },
    async updateSwaypageActivity({ buyersphereId, id, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/activity/${id}`,
        { method: 'PATCH', body: activity }
      )
      const a = find(this.activities[buyersphereId]?.content, a => a.id === id)
      if (a) {
        if (data.value.milestoneId !== undefined) {
          a.milestoneId = data.value.milestoneId
        }
        if (data.value.resolved !== undefined) {
          a.resolved = data.value.resolved
        }
        if (data.value.dueDate !== undefined) {
          a.dueDate = data.value.dueDate
        }
        if (data.value.title !== undefined) {
          a.title = data.value.title
        }
        if (data.value.assignedTo !== undefined) {
          a.assignedTo = data.value.assignedTo
        }
        if (data.value.assignedTeam !== undefined) {
          a.assignedTeam = data.value.assignedTeam
        }
        if (data.value.activityType !== undefined) {
          a.activityType = data.value.activityType
        }
      }
    },
    async fetchSwaypageBuyerActivity({ buyersphereId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerActivity[buyersphereId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerActivity[buyersphereId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${buyersphereId}/buyer-activity`)
        this.buyerActivity[buyersphereId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createResource({ buyersphereId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/resources`,
        { method: 'POST', body: { title, link } }
      )
      this.buyerspheres[buyersphereId].content.resources.push(data.value)
    },
    async updateResource({ buyersphereId, resourceId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/resource/${resourceId}`,
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
        `/v0.1/buyersphere/${buyersphereId}/resource/${resourceId}`,
        { method: 'DELETE' }
      )

      remove(this.buyerspheres[buyersphereId].content.resources, r => r.id === resourceId)
    },
    async createBuyerUser({ buyersphereId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/team/buyer`,
        { method: 'POST', body: user }
      )
      
      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async editBuyerUser({ buyersphereId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/team/buyer/${user.id}`,
        { method: 'PATCH', body: user }
      )
      
      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async removeBuyerUser({ buyersphereId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/team/buyer/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[buyersphereId].content.buyerTeam = data.value
    },
    async addSellerUser({ buyersphereId, user}) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/team/seller`,
        { method: 'POST', body: { user_id: user.id } }
      )
      
      this.buyerspheres[buyersphereId].content.sellerTeam = data.value
    },
    async removeSellerUser({ buyersphereId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/team/seller/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[buyersphereId].content.sellerTeam = data.value
    },
    async fetchSwaypagePages({ buyersphereId, forceRefresh }) {
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
      
      const p = find(this.pages[buyersphereId].content, p => p.id === pageId)
      if (p) {
        if (data.value.title !== undefined) {
          p.title = data.value.title
        }
        if (data.value.body !== undefined) {
          p.body = data.value.body
        }
        if (data.value.isPublic !== undefined) {
          p.isPublic = data.value.isPublic
        }
        if (data.value.ordering !== undefined) {
          p.ordering = data.value.ordering
        }
        if (data.value.canBuyerEdit !== undefined) {
          p.canBuyerEdit = data.value.canBuyerEdit
        }
      }
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
