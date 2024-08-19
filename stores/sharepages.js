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
      await state.fetchSharepage({ sharepageId })
      return state.buyerspheres[sharepageId]?.content
    },
    // TODO can we separate active from archived here without 
    // double fetching? I think we double fetch user data in 
    // when trying to load multiple getters in parallel 
    getSharepageThreadsByIdCached: (state) => async (sharepageId) => {
      await state.fetchSharepageThreads({ sharepageId })
      return state.threads[sharepageId]?.content
    },
    getSharepageLinksByIdCached: (state) => async (sharepageId) => {
      await state.fetchSharepageLinks({ sharepageId })
      return state.links[sharepageId]?.content
    },
    getSharepageBuyerSessionsByIdCached: (state) => async (sharepageId) => {
      await state.fetchSharepageBuyerSessions({ sharepageId })
      return state.buyerSessions[sharepageId]?.content
    },
    getSharepageList: (state) => async () => {
      await state.fetchAllSharepages()
      return state.all.content
    },
    getVirtualSharepageByShortcodeCached: (state) => async (shortcode) => {
      await state.fetchVirtualSharepage({ shortcode })
      return state.virtualSharepages[shortcode]?.content
    }
  },
  actions: {
    async fetchAllSharepages({ forceRefresh } = {}) {
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
    async invalidateAllSharepageCache() {
      const dayjs = useDayjs()
      this.all.generatedAt = dayjs(0).toJSON()
    },
    async createSharepage({ 
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
    async cloneSharepage({ sharepageId, roomType }) {
      const { apiFetch } = useNuxtApp()
      const { data } =  await apiFetch(`/v0.1/swaypage/${sharepageId}/clone`, {
        method: 'POST', 
        body: { roomType }
      })
      return data.value.id
    },
    async createSharepageFromTemplate({ 
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
    async createSharepageFromGlobalTemplate({ 
      buyer, subname, buyerLogo, templateData
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } =  await apiFetch(
        `/v0.1/sharepages/global-template`,
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
    async saveSharepageSettings({
      sharepageId, buyer, subname, buyerLogo, dealAmount, 
      crmOpportunityId, currentStage, showPricing, qualificationDate, 
      evaluationDate, decisionDate, status, isPublic, roomType, priority,
      templateCustomVariables
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}`,
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

      const s = this.buyerspheres[sharepageId].content
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
    async fetchSharepage({ sharepageId, forceRefresh }) {
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
    async getSharepageByShortcode({ shortcode }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/buyersphere/shortcode/${shortcode}`)
      return data?.value
    },
    async createBuyerUser({ sharepageId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/team/buyer`,
        { method: 'POST', body: user }
      )
      
      this.buyerspheres[sharepageId].content.buyerTeam = data.value
    },
    async editBuyerUser({ sharepageId, user }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/team/buyer/${user.id}`,
        { method: 'PATCH', body: user }
      )
      
      this.buyerspheres[sharepageId].content.buyerTeam = data.value
    },
    async removeBuyerUser({ sharepageId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/team/buyer/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[sharepageId].content.buyerTeam = data.value
    },
    async addSellerUser({ sharepageId, user}) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/team/seller`,
        { method: 'POST', body: { user_id: user.id } }
      )
      
      this.buyerspheres[sharepageId].content.sellerTeam = data.value
    },
    async removeSellerUser({ sharepageId, userId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/team/seller/${userId}`,
        { method: 'DELETE' }
      )

      this.buyerspheres[sharepageId].content.sellerTeam = data.value
    },
    async fetchSharepageThreads({ sharepageId, forceRefresh }) {
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
    async createThread({ sharepageId, thread }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${sharepageId}/pages`,
        { method: 'POST', body: thread }
      )
      this.threads[sharepageId].content.push(data.value)
      return data.value.id
    },
    async updateThread({ sharepageId, threadId, thread }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${sharepageId}/page/${threadId}`,
        { method: 'PATCH', body: thread }
      )
      
      const t = find(this.threads[sharepageId].content, t => t.id === threadId)
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
    async deleteThread({ sharepageId, threadId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyerspheres/${sharepageId}/page/${threadId}`,
        { method: 'DELETE' }
      )

      remove(this.threads[sharepageId].content, c => c.id === threadId)
    },
    async reorderThreads({ sharepageId, threads }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${sharepageId}/pages/ordering`,
        { method: 'PATCH', body: threads }
      )
      this.threads[sharepageId] = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
    async fetchSharepageLinks({ sharepageId, forceRefresh }) {
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
    async createLink({ sharepageId, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/links`,
        { method: 'POST', body: link }
      )
      this.links[sharepageId].content.push(data.value)
      return data.value.id
    },
    async updateLink({ sharepageId, linkId, link }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/link/${linkId}`,
        { method: 'PATCH', body: link }
      )
      
      const l = find(this.links[sharepageId].content, l => l.id === linkId)
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
    async deleteLink({ sharepageId, linkId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/link/${linkId}`,
        { method: 'DELETE' }
      )

      remove(this.links[sharepageId].content, l => l.id === linkId)
    },
    async reorderLinks({ sharepageId, links }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/links/ordering`,
        { method: 'PATCH', body: links }
      )
      this.links[sharepageId] = {
        content: data.value,
        generatedAt: dayjs().toJSON()
      }
    },
    async fetchSharepageBuyerSessions({ sharepageId, forceRefresh }) {
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
    async fetchVirtualSharepage({ shortcode, forceRefresh }) {
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
