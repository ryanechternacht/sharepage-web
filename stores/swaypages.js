import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useSwaypagesStore = defineStore('swaypages', {
  state: () => ({ 
    buyerspheres: {},
    chapters: {},
    links: {},
    buyerSessions: {},
    all: {},
  }),
  getters: {
    getSwaypageByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypage({ swaypageId })
      return state.buyerspheres[swaypageId]?.content
    },
    // TODO can we separate active from archived here without 
    // double fetching? I thihnk we double fetch user data in 
    // when trying to load multiple getters in parallel 
    getSwaypageChaptersByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypagePages({ swaypageId })
      return state.chapters[swaypageId]?.content
    },
    getSwaypageLinksByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageLinks({ swaypageId })
      return state.links[swaypageId]?.content
    },
    getSwaypageBuyerSessionsByIdCached: (state) => async (swaypageId) => {
      await state.fetchSwaypageBuyerSessions({ swaypageId })
      return state.buyerSessions[swaypageId]?.content
    },
    getSwaypageList: (state) => async () => {
      await state.fetchAllSwaypages()
      return state.all.content
    }
  },
  actions: {
    async fetchAllSwaypages({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.all?.content
          || forceRefresh
          || is10MinutesOld(this.all?.generatedAt))
      {
        const { data } =  await apiFetch('/v0.1/buyerspheres')
        this.all.content = data.value
        this.all.generatedAt = dayjs().toJSON()
      }
    },
    async invalidateAllSwaypageCache() {
      const dayjs = useDayjs()
      this.all.generatedAt = dayjs(0).toJSON()
    },
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
    async createSwaypageFromTemplate({ 
      templateId, buyer, subname, buyerLogo, templateData
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } =  await apiFetch(
        `/v0.1/buyerspheres/template/${templateId}`,
        {
          method: 'POST', 
          body: { 
            buyer,
            subname,
            buyerLogo,
            templateData
          } 
        }
      )
      return data.value.id
    },
    async saveSwaypageSettings({
      swaypageId, buyer, subname, buyerLogo, dealAmount, 
      crmOpportunityId, currentStage, showPricing, qualificationDate, 
      evaluationDate, decisionDate, status, isPublic, roomType
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
            roomType,
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

      if (!this.chapters[swaypageId]?.content
          || forceRefresh
          || is10MinutesOld(this.chapters[swaypageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${swaypageId}/pages`)
        this.chapters[swaypageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createChapter({ swaypageId, chapter }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages`,
        { method: 'POST', body: chapter }
      )
      this.chapters[swaypageId].content.push(data.value)
      return data.value.id
    },
    async updateChapter({ swaypageId, chapterId, chapter }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${chapterId}`,
        { method: 'PATCH', body: chapter }
      )
      
      const p = find(this.chapters[swaypageId].content, p => p.id === chapterId)
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
    async deleteChapter({ swaypageId, chapterId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${chapterId}`,
        { method: 'DELETE' }
      )

      remove(this.chapters[swaypageId].content, c => c.id === chapterId)
    },
    async reorderChapters({ swaypageId, chapters }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages/ordering`,
        { method: 'PATCH', body: chapters }
      )
      this.chapters[swaypageId] = {
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
