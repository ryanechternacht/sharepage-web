import { defineStore } from 'pinia'

export const useFeaturesStore = defineStore('features', {
  state: () => ({ features: {} }),
  actions: {
    // save(buyersphere) {
    //   // TODO call out to a backend
    //   this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    // },
    async fetchFeatures({} = {}) {
      // TODO support force refresh
      // TODO support urls file?
      // TODO support more stuff better?
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/features`
      )
      this.features = data
    }
  }
})
