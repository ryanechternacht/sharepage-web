import { defineStore } from 'pinia'

export const usePersonasStore = defineStore('personas', {
  state: () => ({ personas: {} }),
  actions: {
    // save(buyersphere) {
    //   // TODO call out to a backend
    //   this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    // },
    async fetchPersonas({} = {}) {
      // TODO support force refresh
      // TODO support urls file?
      // TODO support more stuff better?
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/personas`
      )
      this.personas = data
    }
  }
})
