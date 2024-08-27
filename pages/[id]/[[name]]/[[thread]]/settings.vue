<template>
  <div>
    <div class="h-[2.375rem] flex flex-row items-center gap-2">
      <UButton
        icon="i-heroicons-arrow-left" 
        variant="ghost"
        color="gray"
        :to="makeInternalSharepageLink(sharepage, chapterId)" />
        <h1>Settings</h1>
      <div class="flex-grow" />
      <!-- <div>active</div> -->
      <div class="flex flex-row items-center gap-2">
        <UIcon class="text-orange-300 icon-menu" name="i-heroicons-lock-closed" />
        <div class="subtext">Internal Only</div>
      </div>
    </div>
    <div class="page-area">
      <UHorizontalNavigation :links="links"
        :ui="{ base: 'max-w-[10rem]' }"
        class="mb-4" />

      <div class="flex flex-col gap-4 max-w-[600px] px-[10px]">
        <UFormGroup label="Thread Title" required>
          <UInput v-model="title"
            placeholder="Thread Title" />
        </UFormGroup>

        <UFormGroup label="Thread Type" required>
          <USelect v-model="chapterType"
            placeholder="Thread Type" 
            :options="chapterTypes" />
        </UFormGroup>

        <!-- <UFormGroup label="Can Buyer Edit" required>
          <USelect v-model="canBuyerEdit"
            :options="canBuyerEditOptions" />
        </UFormGroup> -->
      </div>

      <SubmitButton
        class="mt-8 ml-[10px]"
        icon="i-heroicons-pencil-square"
        ready-text="Save"
        submitting-text="Savings"
        submitted-text="Saved"
        error-text="Try Again"
        :disabled="needsMoreInput"
        :submissionState="submissionState"
        @click="submitFn" />
    </div>
  </div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, find, map } = lodash_pkg;

const route = useRoute()
const sharepageId = parseInt(route.params.id)
const chapterId = parseInt(route.params.thread)

const sharepageStore = useSharepagesStore()
const { 
  getSharepageByIdCached, 
  getSharepageThreadsByIdCached, 
} = storeToRefs(sharepageStore)

const [sharepage, chapters] = await Promise.all([
  getSharepageByIdCached.value(sharepageId),
  getSharepageThreadsByIdCached.value(sharepageId),
])

const { 
  makeInternalSharepageLink, 
  makeSharepageThreadSettingsLink,
} = useSharepageLinks()

const { getSharepageThreadTypeIcon } = useSharepageIcons()

const links = computed(() => filter(
  concat(
    [{
      label: 'Sharepage',
      icon: 'i-heroicons-document',
      to: makeInternalSharepageLink(sharepage, 'settings')
    }], 
    sharepage.roomType === 'template' ? {
      label: 'Variables',
      icon: 'i-heroicons-variable',
      to: makeInternalSharepageLink(sharepage, 'variables')
    } : null,
    map(chapters, (chapter) => ({
      label: chapter.title,
      icon: getSharepageThreadTypeIcon(chapter.pageType),
      to: makeSharepageThreadSettingsLink(sharepage, chapter.id)
    }))),
    x => x
))

const chapter = find(chapters, c => c.id === chapterId)

const title = ref(chapter.title)
// const canBuyerEdit = ref(chapter.canBuyerEdit ? 'Yes' : 'No')
// const canBuyerEditOptions = ['Yes', 'No']

const chapterType = ref(chapter.pageType)
const chapterTypes = [
  {
    label: 'General Thread',
    value: 'general',
  }, {
    label: 'Follow-up Thread',
    value: 'follow-up',
  }, {
    label: 'Guide',
    value: 'guide',
  }, {
    label: 'Discussion Doc',
    value: 'discussion',
  }, {
    label: 'Business Case',
    value: 'business-case',
  }, {
    label: 'Notes',
    value: 'notes',
  },
]

const { submissionState, submitFn } = useSubmit(async () => {
  await sharepageStore.updateThread({
    sharepageId,
    threadId: chapter.id,
    thread: {
      title,
      pageType: chapterType,
      // canBuyerEdit: canBuyerEdit.value === 'Yes',
    },
  })
})

const needsMoreInput = computed(() => !title.value || !chapterType.value)
// || !canBuyerEdit.value)
</script>

<style lang="postcss" scoped>
.page-area {
  @apply border border-gray-200 rounded-md px-2 pt-1 pb-4;
  /* this is based on the current top nav height */
  overflow: hidden;
}
</style>
