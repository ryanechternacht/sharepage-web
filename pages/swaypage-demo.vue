<template>
  <div class="grid custom-subgrid col-span-2">
    <div class="center-area">
      <VueDraggable
      v-model="body.sections"
      ghost-class="ghost"
      :animation="200"
      :scroll="true"
      class="flex flex-col gap-2"
      group="sections"
      handle=".drag-handle"
    >
      <template v-for="(section, index) in body.sections"
        :key="section.key">
        <EditorTextArea v-if="section.type === 'text'"
          v-model="section.text"
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />
        
        <EditorHeader v-if="section.type === 'header'"
          v-model="section.text"
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @delete:item="removeItem(index)" />

        <EditorAsset v-if="section.type === 'asset'"
          v-model="section.link"
          :readonly="!canEdit"
          @insert:text="newTextBlock(index)"
          @insert:header="newHeader(index)"
          @insert:asset="newAsset(index)"
          @click:item="assetClick(section.link)"
          @delete:item="removeItem(index)" />
      </template>
    </VueDraggable>
    </div>
    <div class="ml-2">
      <div class="sticky top-[5.75rem]">
        <div class="mt-[5.75rem] flex flex-col gap-4 items-end">
          <div class="text-gray-medium">Key Links</div>
          <a v-for="link in links"
            class="rightbar-link"
            :href="link.link">
            <ExternalLinkIcon class="icon-menu" />
            <div class="text-right">{{ link.text }}</div>
          </a>
          <div class="rightbar-link cursor-pointer">
            <MessageCircleIcon class="icon-menu" />
            <div class="text-right">Please Opt Me Out</div>
          </div>
          <div class="rightbar-link cursor-pointer"
            @click="addNewLink">
            <PlusSquareIcon class="icon-menu text-gray-medium" />
            <div class="text-gray-medium text-right">New Link</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep, debounce, find, first, map, max, some } = lodash_pkg;
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { useBuyerActivityStore } from '@/stores/buyer-activity';
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import { useModal } from 'vue-final-modal'
import EditPageSettingsModal from '@/components/Swaypage/EditPageSettingsModal'

useEmbedly()

// 65/123445566/60
// TODO dynamic
const swaypageId = 65

const buyersphereStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(buyersphereStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller, getMeCached } = storeToRefs(usersStore)

const [buyersphere, pages, hasUser, isSeller, user] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
  getMeCached.value(),
])

// TODO dynamic
const pageId = 60
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

// TODO dynamic
const canEdit = true // isSeller || page.canBuyerEdit

// TODO implement
function updateSection (s) { return s; }
const body = ref({ sections: map(page.body.sections, updateSection) })

definePageMeta({
  layout: 'swaypage'
})

const links = ref([
  {
    text: 'Schedule a Call',
    link: 'https://www.google.com',
  },
  {
    text: 'Connect on LinkedIn',
    link: 'https://www.yahoo.com',
  },
  {
    text: 'See our Testemonials',
    link: 'https://www.microsoft.com',
  },
])

function addNewLink () {
  links.value.push({
    text: 'New Link',
    link: 'https://www.facebook.com',
  })
}
</script>

<style lang="postcss" scoped>
.center-area {
  @apply border border-gray-border-dark rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
}

/* should be grid-cols-subgrid, but we need a newer tailwind */
.custom-subgrid {
  grid-template-columns: subgrid;
}

.rightbar-link {
  @apply flex flex-row-reverse items-center gap-3;

}
</style>
