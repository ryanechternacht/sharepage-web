import { defineStore } from 'pinia'

// export const useOrbitsStore = defineStore('orbits', {
//   state: () => ({ user: null, organization: null }),
//   actions: {
//     async fetch() {
//       const { apiUrl } = useNuxtApp()
//       const { data, error } = await useFetch(apiUrl('/users/me'))
//       if (!error) {
//         this.user = data
//         this.organization
//       }
//     }
//   }
  // state: () => ({ orbits: {} }),
  // getters: {
  //   getById: (state) => (id) => state.orbits[id]
  // },
  // actions: {
  //   save(orbit) {
  //     // TODO call out to a backend
  //     this.orbits[orbit.id] = cloneDeep(orbit)
  //   },
  //   async fetchOrbit({ orbitId }) {
  //     // TODO support force refresh
  //     // TODO support urls file?
  //     // TODO support more stuff better?
  //     const { apiUrl } = useNuxtApp()
  //     const { data } = await useFetch(
  //       apiUrl(`/v0.1/orbits/${orbitId}`)
  //     )
  //     this.orbits[orbitId] = data
  //   }
  // }
})