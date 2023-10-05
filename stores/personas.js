import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove, findIndex } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const usePersonasStore = defineStore('personas', {
  state: () => ({ personas: [] }),
  getters: {
    getPersonasCached: (state) => async () => {
      await state.fetchPersonas()
      return state.personas.content
    }
  },
  actions: {
    async createPersona({ persona }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch("/v0.1/personas", {
        method: 'POST',
        body: persona
      })
      this.personas.content.push(data.value)
    },
    async deletePersona({ persona }) {
      console.log('delete?')
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/personas/${persona.id}`, {
        method: 'DELETE',
      })

      remove(this.personas.content, p => p.id === persona.id)
    },
    async fetchPersonas({ forceRefresh } = {}) {
      console.log('fetch?')
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.personas.content
          || forceRefresh
          || is10MinutesOld(this.personas.generatedAt)) {
        const { data } = await apiFetch('/v0.1/personas')
        this.personas = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updatePersona({ persona }) {
      console.log('update?')
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/personas/${persona.id}`, {
        method: 'PUT',
        body: persona
      })

      const i = findIndex(this.personas.content, p => p.id === persona.id)
      this.personas.content[i] = data.value
    }
  }
})
