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
  }),
  getters: {
    getActivitiesForOrganization: (state) => async () => {
      await state.fetchActivities()
      return state.activities?.content
    },
  },
  actions: {
    async fetchActivities({ forceRefresh } = {}) {
      const { apiFetch } = useNuxtApp()
      const dayjs = useDayjs()

      if (!this.activities.content
          || forceRefresh
          || is10MinutesOld(this.activities.generatedAt)) {
        const { data } = await apiFetch('/v0.1/activities')
        this.activities = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async resolveActivity ({ activity, resolved }) {
      const buyersphereStore = useBuyerspheresStore()

      buyersphereStore.updateConversation({
        buyersphereId: activity.buyersphereId,
        conversationId: activity.id,
        resolved,
      })

      remove(this.activities.content, a => a.id === activity.id)
    }
  },
})
