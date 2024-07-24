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
        <div class="sticky top-8 md:min-h-[calc(100vh-6.5rem)] mb-2 md:mb-0 flex flex-col">
          <div class="header-grid">
            <Logo :src="logo" class="icon-header" />
            <h2>{{ pageData['account-name'] }}</h2>
          </div>

          <div class="hidden md:block">
            <div class="mt-[2.25rem] mb-1 text-gray-500 body">Threads</div>
            <div class="flex flex-col">
              <div v-for="t in threads"
                class="flex flex-row items-center">
                <NuxtLink :href="makeVirtualSwaypageLink(shortcode, name, t.id)"
                  class="sidebar-item">
                  <SwaypagePageTypeIcon :page-type="t.pageType" />
                  <div class="text-sm">{{ mustache.render(t.title, pageData) }}</div>
                </NuxtLink>
              </div>
            </div>

            <div>
              <div class="mt-8 mb-1 body text-gray-500">Key Links</div>
              <div class="flex flex-col">
                <div v-for="l in links"
                  class="flex flex-row items-center">
                  <a class="sidebar-item"
                    :href="mustache.render(l.linkUrl, pageData)"
                    target="_blank"
                    @click="trackLinkClick(l.title, l.linkUrl, pageData)">
                    <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                    <div class="text-sm">{{ mustache.render(l.title, pageData) }}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NuxtPage />

      <div class="md:hidden">
        <div class="mt-[2.25rem] mb-1 text-gray-500 body">Threads</div>
        <div class="flex flex-col">
          <div v-for="t in threads"
            class="flex flex-row items-center">
            <NuxtLink :href="makeVirtualSwaypageLink(shortcode, name, t.id)"
              class="sidebar-item">
              <SwaypagePageTypeIcon :page-type="t.pageType" />
              <div class="text-sm">{{ mustache.render(t.title, pageData) }}</div>
            </NuxtLink>
          </div>
        </div>

        <div>
          <div class="mt-8 mb-1 body text-gray-500">Key Links</div>
          <div class="flex flex-col">
            <div v-for="l in links"
              class="flex flex-row items-center">
              <a class="sidebar-item"
                :href="mustache.render(l.linkUrl, pageData)"
                target="_blank"
                @click="trackLinkClick(l.title, l.linkUrl, pageData)">
                <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                <div class="text-sm">{{ mustache.render(l.title, pageData) }}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import mustache from 'mustache'
import lodash_pkg from 'lodash';
const { filter, first } = lodash_pkg;

const route = useRoute()
const shortcode = route.params.shortcode
const name = route.params.name

const swaypageStore = useSwaypagesStore()
const {
  getVirtualSwaypageByShortcodeCached,
  getSwaypageChaptersByIdCached,
  getSwaypageLinksByIdCached,
} = storeToRefs(swaypageStore)

const virtualSwaypage = await getVirtualSwaypageByShortcodeCached.value(shortcode)

const pageData = virtualSwaypage.pageData
const template = virtualSwaypage.template

// TODO we'll need to render pageData into these first
const [threads, links] = await Promise.all([
  getSwaypageChaptersByIdCached.value(template.id),
  getSwaypageLinksByIdCached.value(template.id),
])

const { makeVirtualSwaypageLink } = useSwaypageLinks()

const { makeClearbitLogo } = useLogo();
const logo = computed(() => makeClearbitLogo(pageData.domain))

const linkToPage = ref(useRequestURL().href)
// get the cleaned up url, once it's cleaned up
if (process.client) {
  setTimeout(() => linkToPage.value = window.location.href, 2000)
}

let threadId = route.params.thread && parseInt(route.params.thread)
if (!threadId) {
  threadId = first(filter(threads, t => t.status === 'active')).id
}

const buyerSessionStore = useBuyerSessionStore()
async function trackShare () {
  buyerSessionStore.captureVirtualSwaypageEventIfAppropriate({
    eventType: "click-share",
    shortcode,
    threadId
   })
}

function trackLinkClick(linkText, linkUrl, pageData) {
  buyerSessionStore.captureVirtualSwaypageEventIfAppropriate({
    eventType: "click-link",
    eventData: { 
      linkText: mustache.render(linkText, pageData),
      linkUrl: mustache.render(linkUrl, pageData),
    },
    shortcode,
    threadId,
   })
}
</script>

<style lang="postcss" scoped>
.layout-grid {
  @apply mx-8;
}

@screen md {
  .layout-grid {
    @apply grid;
    grid-template-columns: minmax(150px, 250px) 1fr;
  }
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
