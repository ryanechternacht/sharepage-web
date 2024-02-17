<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="[grid-area:top] page-top bg-gray-hover">
        <h1>{{ startCase(mainSection) }} Settings</h1>
      </div>

      <div class="[grid-area:left]">
        <div class="left-sidebar">
          <h3 class="mb-4">Settings</h3>
          <NuxtLink class="page-link"
            :to="`/settings/personal`"
            :class="{underline: mainSection === 'personal'}">Personal</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/timeline-template`"
            :class="{underline: mainSection === 'timeline-template'}">Timeline Template</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/assets-template`"
            :class="{underline: mainSection === 'assets-template'}">Assets Template</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/admin`"
            :class="{underline: mainSection === 'admin'}">Admin</NuxtLink>

          <div class="h-[80px]" />

          <h3 class="mb-4">Page Templates</h3>
          <NuxtLink v-for="pt in pageTemplates"
            class="page-link"
            :class="{underline: pt.id === mainSection}"
            :to="`/settings/page-template/${pt.id}`">
            {{ pt.title }}
          </NuxtLink>
          <NewButton @click="createNewPageTemplate" />
        </div>
      </div>

      <!-- These return the left, center, left-header, and center-header sections -->
      <SettingsPersonal v-if="mainSection === 'personal'" />
      <SettingsAdmin v-else-if="mainSection === 'admin'" />
      <!-- <SettingsGuideTemplate v-else-if="mainSection === 'guide-template'" /> -->
      <SettingsTimelineTemplate v-else-if="mainSection === 'timeline-template'" />
      <SettingsAssetsTemplate v-else-if="mainSection === 'assets-template'" />
      <SettingsPageTemplate v-else />

      <div class="[grid-area:footer] h-20" />
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { find, startCase } = lodash_pkg;
import { useTemplatesStore } from '@/stores/templates'
import { storeToRefs } from 'pinia'
import AddBuyerspherePageModal from '@/components/Buyersphere/AddBuyerspherePageModal'
import { useModal } from 'vue-final-modal'

const templatesStore = useTemplatesStore()
const { getPageTemplatesCached } = storeToRefs(templatesStore)

const [pageTemplates] = await Promise.all([
  getPageTemplatesCached.value(),
])

const route = useRoute()
const mainSection = computed(() => {
  if (!route.params.section) {
    return 'personal'
  } else if (route.params.section === 'page-template') {
    return find(pageTemplates, pt => pt.id === parseInt(route.params.id)).title
  } else {
    return route.params.section
  }
})
const router = useRouter()
const { open, close } = useModal({
  component: AddBuyerspherePageModal,
  attrs: {
    page: {},
    isTemplate: true,
    async onClose ({ pageId }) {
      close()
      await router.replace({ 
        path: `/settings/page-template/${pageId}`
      })
    }
  }
})

function createNewPageTemplate () {
  open()
}
</script>

<style lang="postcss" scoped>
</style>