import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useActivityTemplateStore = defineStore('activity-template', {
  state: () => ({ items: {} }),
  getters: {
    getActivityTemplateCached: (state) => async () => {
      await state.fetchActivityTemplate()
      return state.items.content
    },
  },
  actions: {
    async createActivityTemplateItem({ activityTemplateItem }) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()
      const { data } = await apiFetch('/v0.1/conversation-template/item', {
        method: 'POST',
        body: activityTemplateItem
      })

      this.items.content.push(data.value)
    },
    async fetchActivityTemplate({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.items.content
          || forceRefresh
          || is10MinutesOld(this.items.generatedAt)) {
        const { data } = await apiFetch('/v0.1/conversation-template')
        this.items = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updateActivityTemplateItem({ id, dueDateDays, message, assignedTo,
      assignedTeam, collaborationType }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/conversation-template/item/${id}`, {
        method: 'PATCH',
        body: { dueDateDays, message, assignedTo, assignedTeam, collaborationType }
      })

      const ct = find(this.items.content, ct => ct.id === id)
      if (data.value.dueDateDays !== undefined) {
        ct.dueDateDays = data.value.dueDateDays
      }
      if (data.value.message !== undefined) {
        ct.message = data.value.message
      }
      if (data.value.assignedTo !== undefined) {
        ct.assignedTo = data.value.assignedTo
      }
      if (data.value.assignedTeam !== undefined) {
        ct.assignedTeam = data.value.assignedTeam
      }
      if (data.value.collaborationType !== undefined) {
        ct.collaborationType = data.value.collaborationType
      }
    },
  },
})
