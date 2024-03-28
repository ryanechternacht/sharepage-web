import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
import { useSwaypagesStore } from './swaypages';

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
        const { data } = await apiFetch('/v0.2/activities')
        this.activities = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async resolveActivity ({ activity, resolved }) {
      const buyersphereStore = useSwaypagesStore()
      activity.resolved = resolved
      await buyersphereStore.updateSwaypageActivity({
        activity,
        swaypageId: activity.buyersphereId,
        id: activity.id,
      })
    },
    async createActivity({ buyersphereId, milestoneId, activity }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${buyersphereId}/milestone/${milestoneId}/activities`,
        { method: 'POST', body: activity }
      )
      this.activities.content.push(data.value)
    },
  },
})
