import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useTemplatesStore = defineStore('templates', {
  state: () => ({ milestoneTemplates: {}, activityTemplates: {} }),
  getters: {
    getMilestoneTemplatesCached: (state) => async () => {
      await state.fetchMilestoneTemplates()
      return state.milestoneTemplates.content
    },
    getActivityTemplatesCached: (state) => async () => {
      await state.fetchActivityTemplates()
      return state.activityTemplates.content
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
    async createActivityTemplate({ activityTemplate }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch('/v0.1/templates/activities', {
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
    }
  },
})
