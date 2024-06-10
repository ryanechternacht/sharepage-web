import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({ 
  }),
  getters: {
  },
  actions: {
    async createCampaign({ title, templateId, file }) {
      const { apiFetch } = useNuxtApp()

      const { data } = await apiFetch('/v0.1/campaigns', {
        method: 'POST',
        body: {
          file,
          title,
          templateId,
        }
      })
    }
  }
})
