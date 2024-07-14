<template>
  <div class="page-grid">
    <div class="min-w-0">
      <div class="h-[2.375rem] flex flex-row items-center gap-6">
        <div class="flex flex-row items-center">
          <UserAvatar
            class="-mr-.5 shrink-0"
            size="small"
            :user="owner" />
          <div v-if="owner" class="ml-4 shrink-0 text-sm">
            Made by {{ owner?.firstName }}
          </div>
        </div>
      </div>

      <div class="page-area">
        <h1 class="mt-10 mb-6 ml-[calc(.75rem+2px)]">{{ title }}</h1>
        <template v-for="section in sections"
          :key="section.key">
          <EditorTextArea v-if="section.type === 'text'"
            v-model="section.text"
            readonly />
          
          <EditorHeader v-if="section.type === 'header'"
            v-model="section.text"
            readonly />

          <!-- TODO this should be removable -->
          <EditorAiPromptTemplate v-if="section.type === 'ai-prompt-template'"
            v-model="section.prompt"
            readonly />

          <EditorAsset v-if="section.type === 'asset'"
            :model-value="section"
            readonly />
        </template>

        <div class="h-[2rem]" /> 
      </div>
    </div>

    <div>
      <div class="ml-2">
        <div class="sticky top-[5.75rem]">
          <div class="mt-[5.75rem] flex flex-col gap-2 items-end">
            <div class="body text-gray-500">Key Links</div>
            <div class="flex flex-col">
              <div v-for="l in links"
                class="flex flex-row-reverse items-center">
                <a class="rightbar-link"
                  :href="mustache.render(l.linkUrl, pageData)"
                  target="_blank"
                  @click="trackLinkClick(l.title)">
                  <UIcon class="icon-menu" name="i-heroicons-arrow-top-right-on-square" />
                  <div class="text-right text-sm">{{ mustache.render(l.title, pageData) }}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, filter, find, findIndex, first, map, max } = lodash_pkg;
import mustache from 'mustache'

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
const owner = virtualSwaypage.owner

const [threads, links] = await Promise.all([
  getSwaypageChaptersByIdCached.value(template.id),
  getSwaypageLinksByIdCached.value(template.id),
])

let threadId = parseInt(route.params.thread)
let thread
// when we get here from a shareable link, the thread id isn't in the url,
// so we'll pull it from the thread we're sending them to
if (threadId) {
  thread = find(threads, t => t.id === threadId)
} else {
  thread = first(filter(threads, t => t.status === 'active'))
  threadId = thread.id
}

const sections = map(thread.body.sections, s => {
  if (s.type === 'header' || s.type === 'text') {
    s.text = mustache.render(s.text, pageData)
  }

  if (s.type === 'asset') {
    s.link = mustache.render(s.link, pageData)
  }

  if (s.type === 'ai-prompt-template') {
    s.type = 'text'
    s.text = pageData.ai[s.key]
  }

  return s
})

const title = mustache.render(thread.title, pageData)

const buyerSessionStore = useBuyerSessionStore()
function trackLinkClick(linkText) {
  buyerSessionStore.capturePageEventIfAppropriate({
    eventType: "click-link",
    eventData: { linkText },
    swaypageId,
    page: threadId,
   })
}
</script>

<style lang="postcss" scoped>
.page-grid {
  @apply grid;
  grid-template-columns: 1fr minmax(150px, 220px);
}

.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height + header above */
  min-height: calc(100vh - 10.375rem);
}

.rightbar-link {
  @apply py-2 w-full flex flex-row-reverse cursor-pointer items-center gap-3;
}
</style>
