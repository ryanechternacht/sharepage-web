import { defineStore } from 'pinia'

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const usePersonasStore = defineStore('personas', {
  state: () => ({ personas: {} }),
  getters: {
    getPersonasCached: (state) => async () => {
      await state.fetchPersonas()
      return state.personas.content
    }
  },
  actions: {
    // save(buyersphere) {
    //   // TODO call out to a backend
    //   this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    // },
    async fetchPersonas({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.personas.content
          || forceRefresh
          || is10MinutesOld(this.personas.generatedAt)) {
        const { data } = await apiFetch(
          `/v0.1/personas`
        )
        this.personas = {
          content: data,
          generatedAt: dayjs().toJSON()
        }
      }
    }
  }
})