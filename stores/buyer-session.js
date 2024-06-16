import { defineStore } from 'pinia'
import { useUsersStore } from './users'

export const useBuyerSessionStore = defineStore('buyer-session', {
  state: () => ({
    sessionId: null,
    currentPage: null,
  }),
  getters: {
  },
  actions: {
    async generateActivitySession({ swaypageId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/session`, 
        { method: 'POST' },
      )
      this.sessionId = data.value.id
    },
    async postActivityData({ swaypageId, body }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/session/${this.sessionId}/timing`,
        { 
          method: 'POST',
          body,
        }
      )
    },
    async capturePageTimingIfAppropriate({ swaypageId, page }) {
      // All of my attempts to create sessions server side and pass them
      // to the client (to save time client side), have failed
      // miserably. It feels like it _should work_, but it appears to 
      // not be for some reason. I think that reason is how I'm trying
      // to use pinia as a cache, instead of using nuxt api fetching
      // items as the cache
      if (process.server) {
        return;
      }

      const usersStore = useUsersStore()
      const shouldTrack = !(await usersStore.isUserSeller())

      if (!shouldTrack) {
        return
      }

      const { timeMe } = useNuxtApp()

      console.log('page', page)

      // setup
      if (!this.sessionId) {
        await this.generateActivitySession({ swaypageId })

        timeMe.initialize({
          currentPageName: page,
          idleTimeoutInSeconds: 15,
        })
        this.currentPage = page
      
        timeMe.callWhenUserLeaves(async () => {
          await this.postActivityData({ 
            swaypageId, 
            body: timeMe.getTimeOnAllPagesInSeconds()
          })
        })

        setInterval(async () => {
          if (!timeMe.isUserCurrentlyIdle) {
            await this.postActivityData({ 
              swaypageId, 
              body: timeMe.getTimeOnAllPagesInSeconds()
            })
          }
        }, 1000 * 10)
      }

      // handle switching pages
      if (this.currentPage !== page) {
        timeMe.stopTimer(this.currentPage)
        timeMe.setCurrentPageName(page)

        await this.postActivityData({ 
          swaypageId, 
          body: timeMe.getTimeOnAllPagesInSeconds()
        })
      }

      timeMe.startTimer(page)
      this.currentPage = page
    },
    async capturePageEventIfAppropriate ({ swaypageId, page, eventType, eventData }) {
      if (!this.sessionId) {
        return
      }
      
      const { apiFetch } = useNuxtApp()
       await apiFetch(
        `/v0.1/buyersphere/${swaypageId}/session/${this.sessionId}/${page}/event`, 
        { 
          method: 'POST',
          body: { eventType, eventData }
        },
      )
    }
  }
})