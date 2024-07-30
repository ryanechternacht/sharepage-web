import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useSharepagesStore = defineStore('sharepages', {
  state: () => ({ 
    buyerspheres: {},
    threads: {},
    links: {},
    buyerSessions: {},
    all: {},
    virtualSharepages: {},
  }),
  getters: {
    getSharepageByIdCached: (state) => async (sharepageId) => {
      await state.fetchSwaypage({ sharepageId })
      return state.buyerspheres[sharepageId]?.content
    },
    // TODO can we separate active from archived here without 
    // double fetching? I think we double fetch user data in 
    // when trying to load multiple getters in parallel 
    getSharepageThreadsByIdCached: (state) => async (sharepageId) => {
      await state.fetchSwaypagePages({ sharepageId })
      return state.threads[sharepageId]?.content
    },
    getSharepageLinksByIdCached: (state) => async (sharepageId) => {
      await state.fetchSwaypageLinks({ sharepageId })
      return state.links[sharepageId]?.content
    },
    getSharepageBuyerSessionsByIdCached: (state) => async (sharepageId) => {
      await state.fetchSwaypageBuyerSessions({ sharepageId })
      return state.buyerSessions[sharepageId]?.content
    },
    getSharepageList: (state) => async () => {
      await state.fetchAllSwaypages()
      return state.all.content
    },
    getVirtualSharepageByShortcodeCached: (state) => async (shortcode) => {
      await state.fetchVirtualSwaypage({ shortcode })
      return state.virtualSharepages[shortcode]?.content
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
    async cloneSwaypage({ swaypageId, roomType }) {
      const { apiFetch } = useNuxtApp()
      const { data } =  await apiFetch(`/v0.1/swaypage/${swaypageId}/clone`, {
        method: 'POST', 
        body: { roomType }
      })
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
      evaluationDate, decisionDate, status, isPublic, roomType, priority,
      templateCustomVariables
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
            priority,
            templateCustomVariables,
          } 
        }
      )

      const s = this.buyerspheres[swaypageId].content
      s.currentStage = data.value.currentStage
      s.buyer = data.value.buyer
      s.subname = data.value.subname
      s.buyerLogo = data.value.buyerLogo
      s.showPricing = data.value.showPricing
      s.qualificationDate = data.value.qualificationDate
      s.evaluationDate = data.value.evaluationDate
      s.decisionDate = data.value.decisionDate
      s.dealAmount = data.value.dealAmount
      s.crmOpportunityId = data.value.crmOpportunityId
      s.status = data.value.status
      s.isPublic = data.value.isPublic
      s.priority = data.value.priority
      s.templateCustomVariables = data.value.templateCustomVariables
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
    async fetchSwaypage({ sharepageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerspheres[sharepageId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerspheres[sharepageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${sharepageId}`)
        this.buyerspheres[sharepageId] = {
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
    async fetchSwaypagePages({ sharepageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.threads[sharepageId]?.content
          || forceRefresh
          || is10MinutesOld(this.threads[sharepageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyerspheres/${sharepageId}/pages`)

        this.threads[sharepageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createThread({ swaypageId, thread }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages`,
        { method: 'POST', body: thread }
      )
      this.threads[swaypageId].content.push(data.value)
      return data.value.id
    },
    async updateThread({ swaypageId, threadId, thread }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${threadId}`,
        { method: 'PATCH', body: thread }
      )
      
      const t = find(this.threads[swaypageId].content, t => t.id === threadId)
      if (t) {
        if (data.value.title !== undefined) {
          t.title = data.value.title
        }
        if (data.value.body !== undefined) {
          t.body = data.value.body
        }
        if (data.value.isPublic !== undefined) {
          t.isPublic = data.value.isPublic
        }
        if (data.value.ordering !== undefined) {
          t.ordering = data.value.ordering
        }
        if (data.value.canBuyerEdit !== undefined) {
          t.canBuyerEdit = data.value.canBuyerEdit
        }
        if (data.value.status !== undefined) {
          t.status = data.value.status
        }
        if (data.value.pageType !== undefined) {
          t.pageType = data.value.pageType
        }
      }
    },
    async deleteThread({ swaypageId, threadId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/page/${threadId}`,
        { method: 'DELETE' }
      )

      remove(this.threads[swaypageId].content, c => c.id === threadId)
    },
    async reorderThreads({ swaypageId, threads }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${swaypageId}/pages/ordering`,
        { method: 'PATCH', body: threads }
      )
      this.threads[swaypageId] = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
    async fetchSwaypageLinks({ sharepageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.links[sharepageId]?.content
          || forceRefresh
          || is10MinutesOld(this.links[sharepageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${sharepageId}/links`)
        this.links[sharepageId] = {
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
    async fetchSwaypageBuyerSessions({ sharepageId, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerSessions[sharepageId]?.content
          || forceRefresh
          || is10MinutesOld(this.buyerSessions[sharepageId]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/buyersphere/${sharepageId}/sessions`)
        this.buyerSessions[sharepageId] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async fetchVirtualSwaypage({ shortcode, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.virtualSharepages[shortcode]?.content
          || forceRefresh
          || is10MinutesOld(this.virtualSharepages[shortcode]?.generatedAt))
      {
        const { data } = await apiFetch(`/v0.1/virtual-swaypage/${shortcode}`)

        const { convertPageData } = usePageData()
        const obj = data.value
        obj.pageData = convertPageData(obj.virtualSwaypage.pageData)

        this.virtualSharepages[shortcode] = {
          content: obj,
          generatedAt: dayjs().toJSON()
        }
      }
    },
  },
})
