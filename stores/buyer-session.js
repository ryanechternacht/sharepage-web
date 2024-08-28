import { defineStore } from 'pinia'
import { useUsersStore } from './users'

export const useBuyerSessionStore = defineStore('buyer-session', {
  state: () => ({
    sessionId: null,
    currentThread: null,
  }),
  getters: {
  },
  actions: {
    async generateSharepageActivitySession({ sharepageId }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/session`, 
        { method: 'POST' },
      )
      this.sessionId = data.value.id
    },
    async postSharepageTimingData({ sharepageId, body }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/session/${this.sessionId}/timing`,
        { 
          method: 'POST',
          body,
        }
      )
    },
    async captureThreadTimingIfAppropriate({ sharepageId, thread }) {
      // All of my attempts to create sessions server side and pass them
      // to the client (to save time client side), have failed
      // miserably. It feels like it _should work_, but it appears to 
      // not be for some reason. I think that reason is how I'm trying
      // to use pinia as a cache, instead of using nuxt api fetching
      // items as the cache
      if (process.server) {
        return
      }

      const usersStore = useUsersStore()
      const shouldTrack = !(await usersStore.isUserSeller())

      if (!shouldTrack) {
        return
      }

      const { timeMe } = useNuxtApp()

      // setup
      if (!this.sessionId) {
        await this.generateSharepageActivitySession({ sharepageId })

        timeMe.initialize({
          currentThreadName: thread,
          idleTimeoutInSeconds: 2,
        })
        this.currentThread = thread
      
        timeMe.callWhenUserLeaves(async () => {
          await this.postSharepageTimingData({ 
            sharepageId, 
            body: timeMe.getTimeOnAllPagesInSeconds()
          })
        })

        setInterval(async () => {
          if (!timeMe.isUserCurrentlyIdle) {
            await this.postSharepageTimingData({ 
              sharepageId, 
              body: timeMe.getTimeOnAllPagesInSeconds()
            })
          }
        }, 1000 * 10)
      }

      // handle switching pages
      if (this.currentThread !== thread) {
        timeMe.stopTimer(this.currentThread)
        timeMe.setcurrentThreadName(thread)

        await this.postSharepageTimingData({ 
          sharepageId, 
          body: timeMe.getTimeOnAllPagesInSeconds()
        })
      }

      timeMe.startTimer(thread)
      this.currentThread = thread
    },
    async captureThreadEventIfAppropriate ({ sharepageId, thread, eventType, eventData }) {
      if (!this.sessionId) {
        return
      }
      
      const { apiFetch } = useNuxtApp()
       await apiFetch(
        `/v0.1/buyersphere/${sharepageId}/session/${this.sessionId}/${thread}/event`, 
        {
          method: 'POST',
          body: { eventType, eventData }
        },
      )
    },
    async generateVirtualSharepageActivitySession({ shortcode }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/virtual-swaypage/${shortcode}/session`, 
        { method: 'POST' },
      )
      this.sessionId = data.value.id
    },
    async postVirtualSharepageTimingData({ shortcode, body }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(
        `/v0.1/virtual-swaypage/${shortcode}/session/${this.sessionId}/timing`,
        { 
          method: 'POST',
          body,
        }
      )
    },
    async captureVirtualSharepageThreadTimingIfAppropriate({ shortcode, threadId }) {
      // All of my attempts to create sessions server side and pass them
      // to the client (to save time client side), have failed
      // miserably. It feels like it _should work_, but it appears to 
      // not be for some reason. I think that reason is how I'm trying
      // to use pinia as a cache, instead of using nuxt api fetching
      // items as the cache
      if (process.server) {
        return
      }

      const usersStore = useUsersStore()
      const shouldTrack = !(await usersStore.isUserSeller())

      if (!shouldTrack) {
        return
      }

      const { timeMe } = useNuxtApp()

      // setup
      if (!this.sessionId) {
        await this.generateVirtualSharepageActivitySession({ shortcode })

        timeMe.initialize({
          currentThreadName: threadId,
          idleTimeoutInSeconds: 2,
        })
        this.currentThread = threadId
      
        timeMe.callWhenUserLeaves(async () => {
          await this.postVirtualSharepageTimingData({ 
            shortcode, 
            body: timeMe.getTimeOnAllPagesInSeconds()
          })
        })

        setInterval(async () => {
          if (!timeMe.isUserCurrentlyIdle) {
            await this.postVirtualSharepageTimingData({ 
              shortcode, 
              body: timeMe.getTimeOnAllPagesInSeconds()
            })
          }
        }, 1000 * 10)
      }

      // handle switching threads
      if (this.currentThread !== threadId) {
        timeMe.stopTimer(this.currentThread)
        timeMe.setcurrentThreadName(threadId)

        await this.postVirtualSharepageTimingData({ 
          shortcode, 
          body: timeMe.getTimeOnAllPagesInSeconds()
        })
      }

      timeMe.startTimer(threadId)
      this.currentThread = threadId
    },
    async captureVirtualSharepageEventIfAppropriate ({ shortcode, threadId, eventType, eventData }) {
      if (!this.sessionId) {
        return
      }

      const { apiFetch } = useNuxtApp()
       await apiFetch(
        `/v0.1/virtual-swaypage/${shortcode}/session/${this.sessionId}/${threadId}/event`, 
        { 
          method: 'POST',
          body: { eventType, eventData }
        },
      )
    },
  }
})