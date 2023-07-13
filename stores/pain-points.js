import { defineStore } from 'pinia'

export const usePainPointsStore = defineStore('pain-points', {
  state: () => ({ painPoints: {} }),
  actions: {
    // save(buyersphere) {
    //   // TODO call out to a backend
    //   this.buyerspheres[buyersphere.id] = cloneDeep(buyersphere)
    // },
    async fetchPainPoints({} = {}) {
      // TODO support force refresh
      // TODO support urls file?
      // TODO support more stuff better?
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(
        `/v0.1/pain-points`
      )
      this.painPoints = data
    }
  }
})
