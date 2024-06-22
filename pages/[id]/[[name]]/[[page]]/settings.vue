<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-6">
      <h1>Settings</h1>
      <div class="flex-grow" />
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
        <div class="subtext">Internal Only</div>
      </div>
    </div>
    <div class="page-area">
      <UHorizontalNavigation :links="links" />
      {{ swaypageId }} <br>
      {{ page }} <br>
      settings!
    </div>
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useBuyerSessionStore } from '@/stores/buyer-session';
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, map } = lodash_pkg;

const route = useRoute()
const swaypageId = parseInt(route.params.id)
const page = parseInt(route.params.page)

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypageChaptersByIdCached, 
} = storeToRefs(swaypageStore)

const buyerSessionStore = useBuyerSessionStore()

const [swaypage, pages] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypageChaptersByIdCached.value(swaypageId),
])

const { 
  makeInternalSwaypageLink, 
  makeSwaypageChapterSettingsLink,
} = useSwaypageLinks()

const { getSwaypageTypeIcon } = useSwayageIcons()

const links = computed(() => concat([{
  label: 'Swaypage',
  icon: 'i-heroicons-document',
  to: makeInternalSwaypageLink(swaypage, 'settings')
}], map(pages, (page) => ({
  label: page.title,
  icon: getSwaypageTypeIcon(page.pageType),
  to: makeSwaypageChapterSettingsLink(swaypage, page.id)
}))))
</script>
