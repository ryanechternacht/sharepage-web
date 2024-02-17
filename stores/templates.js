import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useTemplatesStore = defineStore('templates', {
  state: () => ({ 
    milestoneTemplates: {},
    activityTemplates: {},
    pageTemplates: {},
  }),
  getters: {
    getMilestoneTemplatesCached: (state) => async () => {
      await state.fetchMilestoneTemplates()
      return state.milestoneTemplates.content
    },
    getActivityTemplatesCached: (state) => async () => {
      await state.fetchActivityTemplates()
      return state.activityTemplates.content
    },
    getPageTemplatesCached: (state) => async () => {
      await state.fetchPageTemplates()
      return state.pageTemplates.content
    },
  },
  actions: {
    async createMilestoneTemplate({ milestoneTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch('/v0.1/templates/milestones', {
        method: 'POST',
        body: milestoneTemplate
      })

      this.milestoneTemplates.content.push(data.value)
    },
    async fetchMilestoneTemplates({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.milestoneTemplates.content
          || forceRefresh
          || is10MinutesOld(this.milestoneTemplates.generatedAt)) {
        const { data } = await apiFetch('/v0.1/templates/milestones')
        this.milestoneTemplates = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updateMilestoneTemplate({ id, milestoneTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/templates/milestone/${id}`, {
        method: 'PATCH',
        body: milestoneTemplate
      })

      const mt = find(this.milestoneTemplates.content, mt => mt.id === id)
      if (data.value.title !== undefined) {
        mt.title = data.value.title
      }
    },
    async deleteMilestoneTemplate({ id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/templates/milestone/${id}`,
        { method: 'DELETE' }
      )

      remove(this.milestoneTemplates.content, mt => mt.id === id)
    },
    async createActivityTemplate({ activityTemplate, milestoneTemplateId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/templates/milestone/${milestoneTemplateId}/activities`, {
        method: 'POST',
        body: activityTemplate
      })

      this.activityTemplates.content.push(data.value)
    },
    async fetchActivityTemplates({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.activityTemplates.content
          || forceRefresh
          || is10MinutesOld(this.activityTemplates.generatedAt)) {
        const { data } = await apiFetch('/v0.1/templates/activities')
        this.activityTemplates = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updateActivityTemplate({ id, activityTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/templates/activity/${id}`, {
        method: 'PATCH',
        body: activityTemplate
      })

      const at = find(this.activityTemplates.content, at => at.id === id)
      if (data.value.milestoneTemplateId !== undefined) {
        at.milestoneTemplateId = data.value.milestoneTemplateId
      }
      if (data.value.title !== undefined) {
        at.title = data.value.title
      }
      if (data.value.assignedTeam !== undefined) {
        at.assignedTeam = data.value.assignedTeam
      }
      if (data.value.activityType !== undefined) {
        at.activityType = data.value.activityType
      }
    },
    async deleteActivityTemplate({ id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/templates/activity/${id}`,
        { method: 'DELETE' }
      )

      remove(this.activityTemplates.content, at => at.id === id)
    },
    async createPageTemplate({ pageTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/templates/pages`, {
        method: 'POST',
        body: pageTemplate
      })

      this.pageTemplates.content.push(data.value)
      return data.value.id
    },
    async fetchPageTemplates({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.pageTemplates.content
          || forceRefresh
          || is10MinutesOld(this.pageTemplates.generatedAt)) {
        const { data } = await apiFetch('/v0.1/templates/pages')
        this.pageTemplates = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updatePageTemplate({ id, pageTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/templates/page/${id}`, {
        method: 'PATCH',
        body: pageTemplate
      })

      const pt = find(this.pageTemplates.content, pt => pt.id === id)
      if (data.value.title !== undefined) {
        pt.title = data.value.title
      }
      if (data.value.body !== undefined) {
        pt.body = data.value.body
      }
      if (data.value.isPublic !== undefined) {
        pt.isPublic = data.value.isPublic
      }
      if (data.value.ordering !== undefined) {
        pt.ordering = data.value.ordering
      }
    },
    async deletePageTemplate({ id }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/templates/page/${id}`,
        { method: 'DELETE' }
      )

      remove(this.pageTemplates.content, pt => pt.id === id)
    },
  },
})
