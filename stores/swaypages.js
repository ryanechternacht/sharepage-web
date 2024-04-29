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
    links: {},
    buyerSessions: {},
  }),
  getters: {
    getSwaypageByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypage({ swaypageId })
      return state.buyerspheres[swaypageId]?.content
    },
    getSwaypageMilestonesByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageMilestones({ swaypageId })
      return state.milestones[swaypageId]?.content
    },
    getSwaypageActivitiesByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageActivities({ swaypageId })
      return state.activities[swaypageId]?.content
    },
    getSwaypageBuyerActivityByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageBuyerActivity({ swaypageId })
      return state.buyerActivity[swaypageId]?.content
    },
    // TODO can we separate active from archived here without 
    // double fetching? I thihnk we double fetch user data in 
    // when trying to load multiple getters in parallel 
    getSwaypagePagesByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypagePages({ swaypageId })
      return state.pages[swaypageId]?.content
    },
    getSwaypageLinksByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageLinks({ swaypageId })
      return state.links[swaypageId]?.content
    },
    getSwaypageBuyerSessionsByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageBuyerSessions({ swaypageId })
      return state.buyerSessions[swaypageId]?.content
    },
  },
  actions: {
    async createSwaypage({ 
      buyer, subname, buyerLogo, crmOpportunityId, dealAmount,
      pageTemplateId, pageTitle, roomType
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
            roomType,
          } 
        }
      )
      return data.value.id
    },
    async saveSwaypageSettings({
      swaypageId, buyer, subname, buyerLogo, dealAmount, 
      crmOpportunityId, currentStage, showPricing,  qualificationDate, 
      evaluationDate, decisionDate, status, isPublic 
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}`,
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

      const b = this.buyerspheres[swaypageId].content
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
    async updateBuyerInput({ swaypageId, featuresAnswer, successCriteriaAnswer,
      objectivesAnswer, constraintsAnswer, pricingTierId, status }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}`,
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
      const b = this.buyerspheres && this.buyerspheres[swaypageId]?.content
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
    async fetchSwaypage({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerspheres[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerspheres[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}`)
        this.buyerspheres[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async getSwaypageByShortcode({ shortcode }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/buyersphere/shortcode/${shortcode}`)
      return data?.value
    },
    async fetchSwaypageMilestones({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.milestones[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.milestones[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}/milestones`)
        this.milestones[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createSwaypageMilestone({ swaypageId, milestone }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/milestones`,
        { method: 'POST', body: milestone }
      )
      this.milestones[swaypageId].content.push(data.value)
    },
    async updateSwaypageMilestone({ swaypageId, id, milestone }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/milestone/${id}`,
        { method: 'PATCH', body: milestone }
      )
      const m = find(this.milestones[swaypageId]?.content, m => m.id === id)
      if (m) {
        if (data.value.title !== undefined) {
          m.title = data.value.title
        }
      }
    },
    async deleteSwaypageMilestone({ swaypageId, id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/milestone/${id}`,
        { method: 'DELETE' }
      )

      remove(this.milestones[swaypageId].content, m => m.id === id)
    },
    async fetchSwaypageActivities({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.activities[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.activities[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}/milestones/activities`)
        this.activities[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createSwaypageActivity({ swaypageId, milestoneId, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/milestone/${milestoneId}/activities`,
        { method: 'POST', body: activity }
      )
      this.activities[swaypageId].content.push(data.value)
    },
    async deleteSwaypageActivity({ swaypageId, id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/activity/${id}`,
        { method: 'DELETE' }
      )

      remove(this.activities[swaypageId].content, a => a.id === id)
    },
    async updateSwaypageActivity({ swaypageId, id, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/activity/${id}`,
        { method: 'PATCH', body: activity }
      )
      const a = find(this.activities[swaypageId]?.content, a => a.id === id)
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
    async fetchSwaypageBuyerActivity({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerActivity[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerActivity[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}/buyer-activity`)
        this.buyerActivity[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createResource({ swaypageId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/resources`,
        { method: 'POST', body: { title, link } }
      )
      this.buyerspheres[swaypageId].content.resources.push(data.value)
    },
    async updateResource({ swaypageId, resourceId, title, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/resource/${resourceId}`,
        { method: 'PATCH', body: { title, link }}
      )
      
      const ri = findIndex(
        this.buyerspheres[swaypageId].content.resources, 
        r => r.id === resourceId)
      this.buyerspheres[swaypageId].content.resources[ri] = data.value
    },
    async deleteResource({ swaypageId, resourceId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/resource/${resourceId}`,
        { method: 'DELETE' }
      )

      remove(this.buyerspheres[swaypageId].content.resources, r => r.id === resourceId)
    },
    async createBuyerUser({ swaypageId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/team/buyer`,
        { method: 'POST', body: user }
      )
      
      this.buyerspheres[swaypageId].content.buyerTeam = data.value
    },
    async editBuyerUser({ swaypageId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/team/buyer/${user.id}`,
        { method: 'PATCH', body: user }
      )
      
      this.buyerspheres[swaypageId].content.buyerTeam = data.value
    },
    async removeBuyerUser({ swaypageId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/team/buyer/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[swaypageId].content.buyerTeam = data.value
    },
    async addSellerUser({ swaypageId, user}) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/team/seller`,
        { method: 'POST', body: { user_id: user.id } }
      )
      
      this.buyerspheres[swaypageId].content.sellerTeam = data.value
    },
    async removeSellerUser({ swaypageId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/team/seller/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[swaypageId].content.sellerTeam = data.value
    },
    async fetchSwaypagePages({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.pages[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.pages[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${swaypageId}/pages`)
        this.pages[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createPage({ swaypageId, page }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages`,
        { method: 'POST', body: page }
      )
      this.pages[swaypageId].content.push(data.value)
      return data.value.id
    },
    async updatePage({ swaypageId, pageId, page }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${pageId}`,
        { method: 'PATCH', body: page }
      )
      
      const p = find(this.pages[swaypageId].content, p => p.id === pageId)
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
        if (data.value.status !== undefined) {
          p.status = data.value.status
        }
      }
    },
    async deletePage({ swaypageId, pageId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${pageId}`,
        { method: 'DELETE' }
      )

      remove(this.pages[swaypageId].content, p => p.id === pageId)
    },
    async reorderPages({ swaypageId, pages }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages/ordering`,
        { method: 'PATCH', body: pages }
      )
      this.pages[swaypageId] = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
    async fetchSwaypageLinks({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.links[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.links[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}/links`)
        this.links[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createLink({ swaypageId, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/links`,
        { method: 'POST', body: link }
      )
      this.links[swaypageId].content.push(data.value)
      return data.value.id
    },
    async updateLink({ swaypageId, linkId, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/link/${linkId}`,
        { method: 'PATCH', body: link }
      )
      
      const l = find(this.links[swaypageId].content, l => l.id === linkId)
      if (l) {
        if (data.value.title !== undefined) {
          l.title = data.value.title
        }
        if (data.value.linkUrl !== undefined) {
          l.linkUrl = data.value.linkUrl
        }
        if (data.value.ordering !== undefined) {
          l.ordering = data.value.ordering
        }
      }
    },
    async deleteLink({ swaypageId, linkId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/link/${linkId}`,
        { method: 'DELETE' }
      )

      remove(this.links[swaypageId].content, l => l.id === linkId)
    },
    async reorderLinks({ swaypageId, links }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/links/ordering`,
        { method: 'PATCH', body: links }
      )
      this.links[swaypageId] = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
    async fetchSwaypageBuyerSessions({ swaypageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerSessions[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerSessions[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${swaypageId}/sessions`)
        this.buyerSessions[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
  },
})
