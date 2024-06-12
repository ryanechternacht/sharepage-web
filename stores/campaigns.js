import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { find, remove } = lodash_pkg;

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: {},
  }),
  getters: {
    getCampaignByIdCached: (state) => async (campaignUuid) => {
      await state.fetchCampaign({ campaignUuid })
      return state.campaigns[campaignUuid]?.content
    }
  },
  actions: {
    async fetchCampaign({ campaignUuid, forceRefresh }) {
      const dayjs = useDayjs()
      const { apiFetch } = useNuxtApp()

      if (!this.campaigns[campaignUuid]?.content
          || forceRefresh
          || is10MinutesOld(this.campaigns[campaignUuid]?.generatedAt))
      {
        const { data, error } = await apiFetch(`/v0.1/campaign/${campaignUuid}`)
        this.campaigns[campaignUuid] = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createCampaign({ title, templateId, file }) {
      const { apiFetch } = useNuxtApp()

      const formData = new FormData()

      formData.append('file', unref(file))
      formData.append('title', unref(title))
      formData.append('templateId', unref(templateId))

      const { data } = await apiFetch('/v0.1/campaigns', {
        method: 'POST',
        body: formData
      })
      return data.value.uuid
    },
    async updateCampaign({ uuid, title, columnsApproved, aiPromptsApproved, 
      isPublished 
    }) {
      const { apiFetch } = useNuxtApp()
      const { data } = await apiFetch(`/v0.1/campaign/${uuid}`, { 
        method: 'PATCH',
        body: { 
          title,
          columnsApproved,
          aiPromptsApproved,
          isPublished,
        }
      })

      const c = this.campaigns[uuid].content
      if (data.value.title !== undefined) {
        c.title = data.value.title
      }
      if (data.value.columnsApproved !== undefined) {
        c.columnsApproved = data.value.columnsApproved
      }
      if (data.value.aiPromptsApproved !== undefined) {
        c.aiPromptsApproved = data.value.aiPromptsApproved
      }
      if (data.value.isPublished !== undefined) {
        c.isPublished = data.value.isPublished
      }
    }
  }
})
