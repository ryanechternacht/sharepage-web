<template>
  <div>
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
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { useBuyerSessionStore } from '@/stores/buyer-session'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { capitalize, filter, find, first, map } = lodash_pkg;
import mustache from 'mustache'

const route = useRoute()
const shortcode = route.params.shortcode

const usersStore = useUsersStore()
const { isUserLoggedIn } = storeToRefs(usersStore)

const sharepageStore = useSharepagesStore()
const {
  getVirtualSharepageByShortcodeCached,
  getSharepageThreadsByIdCached,
} = storeToRefs(sharepageStore)

const virtualSharepage = await getVirtualSharepageByShortcodeCached.value(shortcode)

const pageData = virtualSharepage.pageData
const template = virtualSharepage.template
const owner = virtualSharepage.owner

const [threads, hasUser] = await Promise.all([
  getSharepageThreadsByIdCached.value(template.id),
  isUserLoggedIn.value(),
])

const { cookies } = useAppConfig()
const linkedName = useCookie('linked-name', { domain: cookies.domain })
const anonymousId = useCookie('anonymous-id', { domain: cookies.domain })

if (!hasUser && !linkedName.value) {
  const tokens = route.params.name.split('-')
  const capitalized = map(tokens, capitalize)
  linkedName.value = capitalized.join(' ')
}

if (!anonymousId.value && process.client) {
  anonymousId.value = crypto?.randomUUID
    ? crypto.randomUUID()
    : Math.floor(Math.random() * 1000000).toString()
}

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
    s.text = pageData.ai[threadId][s.key]
  }

  return s
})

const title = mustache.render(thread.title, pageData)

const buyerSessionStore = useBuyerSessionStore()
buyerSessionStore.captureVirtualSharepageThreadTimingIfAppropriate({ shortcode, threadId })
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 py-1;
  /* this is based on the current top nav height + header above */
  min-height: calc(100vh - 10.375rem);
}
</style>
