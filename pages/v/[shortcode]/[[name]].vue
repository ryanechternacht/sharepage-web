<template>
  <div>
    <TopNav>
      <template #action-button>
        <CopyToClipboardButton
          :url="linkToPage"
          @click="trackShare" />
      </template>
    </TopNav>
    <div class="mt-6 layout-grid">
      <div class="mr-4">
        <div class="sticky top-8 min-h-[calc(100vh-6.5rem)] flex flex-col">
          <div class="header-grid">
            <Logo :src="logo" class="icon-header" />
            <h2>{{ pageData['account-name'] }}</h2>
          </div>

          <div>
            <div class="mt-[2.25rem] mb-1 text-gray-500 body">Threads</div>
            <div class="flex flex-col">
              <div v-for="p in pages"
                class="flex flex-row items-center">
                <NuxtLink :href="makeVirtualSwaypageLink(shortcode, name, p.id)"
                  class="sidebar-item">
                  <SwaypagePageTypeIcon :page-type="p.pageType" />
                  <div class="text-sm">{{ mustache.render(p.title, pageData) }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NuxtPage />
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import mustache from 'mustache'

const route = useRoute()
const shortcode = route.params.shortcode
const name = route.params.name

const swaypageStore = useSwaypagesStore()
const {
  getVirtualSwaypageByShortcodeCached,
  getSwaypageChaptersByIdCached,
} = storeToRefs(swaypageStore)

const virtualSwaypage = await getVirtualSwaypageByShortcodeCached.value(shortcode)

const pageData = virtualSwaypage.pageData
const template = virtualSwaypage.template

// TODO we'll need to render pageData into these first
const [pages] = await Promise.all([
  getSwaypageChaptersByIdCached.value(template.id),
])

const { makeVirtualSwaypageLink } = useSwaypageLinks()

const logo = computed(() => `https://logo.clearbit.com/${pageData.domain}`)

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}
</script>

<style lang="postcss" scoped>
.layout-grid {
  @apply grid mx-8;
  grid-template-columns: minmax(150px, 250px) 1fr;
}

.header-grid {
  @apply grid items-center gap-x-2 gap-y-2;
  grid-template-columns: auto 1fr;
}

.sidebar-item {
  @apply w-full py-2 my-1 cursor-pointer flex flex-row gap-4 items-center;

  &.router-link-active {
    @apply bg-gray-200 rounded-md py-3 my-0 px-2 -mx-2;

    .text-sm {
      @apply font-semibold;
    }
  }
}
</style>
