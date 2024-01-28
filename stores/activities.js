import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove } = lodash_pkg;
import { useBuyerspheresStore } from './buyerspheres';

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useActivitiesStore = defineStore('activities', {
  state: () => ({ 
    activities: {},
    conversations: {},
  }),
  getters: {
    getActivitiesForOrganization: (state) => async () => {
      await state.fetchActivities()
      return state.activities?.content
    },
    getConversationsForOrganization: (state) => async () => {
      await state.fetchConversations()
      return state.conversations?.content
    },
  },
  actions: {
    async fetchActivities({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()

      if (!this.activities.content
          || forceRefresh
          || is10MinutesOld(this.activities.generatedAt)) {
        const { data } = await apiFetch('/v0.2/activities')
        this.activities = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async resolveActivity ({ activity, resolved }) {
      const buyersphereStore = useBuyerspheresStore()
      await buyersphereStore.updateBuyersphereActivity({ activity, resolved })

      remove(this.activities.content, a => a.id === activity.id)
    },
    async createActivity({ buyersphereId, milestoneId, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestone/${milestoneId}/activities`,
        { method: 'POST', body: activity }
      )
      this.activities.content.push(data.value)
    },
    async fetchConversations({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()

      if (!this.conversations.content
          || forceRefresh
          || is10MinutesOld(this.conversations.generatedAt)) {
        const { data } = await apiFetch('/v0.1/activities')
        this.conversations = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async resolveConversation ({ activity, resolved }) {
      const buyersphereStore = useBuyerspheresStore()

      await buyersphereStore.updateConversation({
        buyersphereId: activity.buyersphereId,
        conversationId: activity.id,
        resolved,
      })

      remove(this.conversations.content, a => a.id === activity.id)
    },
    async createConversation({ buyersphereId, message, dueDate, assignedTo, assignedTeam, collaborationType }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyerspheres/${buyersphereId}/conversations`,
        { method: 'POST', body: {message, dueDate, assignedTo, assignedTeam, collaborationType} }
      )
      this.conversations.content.push(data.value)
    },
  },
})
