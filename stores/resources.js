import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { remove, findIndex } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 1
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({ resources: {} }),
  getters: {
    getResourcesCached: (state) => async () => {
      await state.fetchResources()
      return state.resources.content
    }
  },
  actions: {
    async createResource({ resource }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch("/v0.1/resources", {
        method: 'POST',
        body: resource
      })

      this.resources.content.push(data.value)
    },
    async deleteResource({ resourceId }) {
      const { apiFetch } = useNuxtApp()
      await apiFetch(`/v0.1/resources/${resourceId}`, {
        method: 'DELETE',
      })

      remove(this.resources.content, p => p.id === resourceId)
    },
    async fetchResources({ forceRefresh } = {}) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.resources.content
          || forceRefresh
          || is10MinutesOld(this.resources.generatedAt)) {
        const { data } = await apiFetch('/v0.1/resources')
        this.resources = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async updateResource({ resource }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/resources/${resource.id}`, {
        method: 'PUT',
        body: resource
      })

      const i = findIndex(this.resources.content, p => p.id === resource.id)
      this.resources.content[i] = data.value
    }
  }
})
