import { defineStore } from 'pinia'
import { useUsersStore } from './users'

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useBuyerActivityStore = defineStore('buyer-activity', {
  state: () => ({ 
    buyerActivity: {},
    session: {},
  }),
  getters: {
    getBuyerActivityForOrganizationCached: (state) => async () => {
      await state.fetchBuyerActivity()
      return state.buyerActivity?.content
    },
    shouldTrackUserActivity: (state) => async (swaypageId) =>  {
      const usersStore = useUsersStore()
      const shouldTrack = !(await usersStore.isUserSeller())
      if (shouldTrack && !state.session.id) {
        await state.generateActivitySession({ swaypageId })
      }
      return shouldTrack
    },
  },
  actions: {
    async fetchBuyerActivity({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.buyerActivity.content
          || forceRefresh
          || is10MinutesOld(this.buyerActivity.generatedAt)) {
        const { data } = await apiFetch('/v0.1/buyer-activity')
        this.buyerActivity = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async captureBuyerActivity({ buyersphereId, activity, activityData }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch('/v0.1/buyer-activity',
        { 
          method: 'POST', 
          body: {
            buyersphereId,
            activity,
            activityData,
          },
        }
      )
    },
    async generateActivitySession({ swaypageId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/session`, 
        { method: 'POST' },
        )
      console.log('returned session', data)
      this.session.id = data.value.id
    },
    async capturePageTiming({ swaypageId, page, timeOnPage}) {
      if (process.client) {
        console.log('client')
        console.log('session', this.session, this.session.id)
      } else {
        console.log('not client')
        console.log('session', this.session, this.session.id)
      }
      console.log('session', this.session, this.session.id)
      const { apiFetch } = useNuxtApp()
      const { data, error } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/session/${this.session.id}/timing`,
        { 
          method: 'POST',
          body: { page, timeOnPage },
        }
      )
      console.log('data', data)
      console.log('error', error)
    },
  }
})
