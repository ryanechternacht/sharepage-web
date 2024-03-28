<template>
  <div>
    <TopNav />
    <div class="page-layout">
      <div class="[grid-area:top] page-top bg-gray-hover">
        <h1>{{ header }} Settings</h1>
      </div>

      <div class="[grid-area:left]">
        <div class="left-sidebar">
          <h3 class="mb-4">Settings</h3>
          <!-- TODO use router-link-active instead of manually reimplmenting -->
          <NuxtLink class="page-link"
            :to="`/settings/personal`"
            :class="{underline: currentPage === 'personal'}">Personal</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/timeline-template`"
            :class="{underline: currentPage === 'timeline-template'}">Timeline Template</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/preset-assets`"
            :class="{underline: currentPage === 'preset-assets'}">Pre-set Assets</NuxtLink>
          <NuxtLink class="page-link"
            :to="`/settings/admin`"
            :class="{underline: currentPage === 'admin'}">Admin</NuxtLink>

          <div class="h-[80px]" />

          <h3 class="mb-4">Page Templates</h3>
          <NuxtLink v-for="pt in pageTemplates"
            class="page-link"
            :class="{underline: `${pt.id}` === currentPage}"
            :to="`/settings/page-template/${pt.id}`">
            {{ pt.title }}
          </NuxtLink>
          <NewButton @click="createNewPageTemplate" />
        </div>
      </div>

      <!-- These return the left, center, left-header, and center-header sections -->
      <SettingsPersonal v-if="currentPage === 'personal'" />
      <SettingsAdmin v-else-if="currentPage === 'admin'" />
      <!-- <SettingsGuideTemplate v-else-if="currentPage === 'guide-template'" /> -->
      <SettingsTimelineTemplate v-else-if="currentPage === 'timeline-template'" />
      <SettingsAssetsTemplate v-else-if="currentPage === 'preset-assets'" />
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
import AddSwaypagePageModal from '@/components/Buyersphere/AddSwaypagePageModal'
import { useModal } from 'vue-final-modal'

const templatesStore = useTemplatesStore()
const { getPageTemplatesCached } = storeToRefs(templatesStore)

const [pageTemplates] = await Promise.all([
  getPageTemplatesCached.value(),
])

const route = useRoute()
const currentPage = computed(() => {
  if (!route.params.section) {
    return 'personal'
  } else if (route.params.section === 'page-template') {
    return route.params.id
  } else {
    return route.params.section
  }
})

const header = computed(() => {
  if (route.params.section === 'page-template') {
    return find(pageTemplates, pt => pt.id === parseInt(route.params.id)).title
  } else if (route.params.section === 'preset-assets') {
    return 'Pre-set Assets'
  } else {
    return startCase(currentPage.value)
  }
})

const router = useRouter()
const { open, close } = useModal({
  component: AddSwaypagePageModal,
  attrs: {
    page: {},
    isTemplate: true,
    async onClose (props) {
      if (props?.pageId) {
        await router.replace({ 
          path: `/settings/page-template/${props.pageId}`
        })
      }
      close()
    }
  }
})

function createNewPageTemplate () {
  open()
}
</script>

<style lang="postcss" scoped>
</style>