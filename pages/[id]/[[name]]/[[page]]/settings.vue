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
      <UHorizontalNavigation :links="links"
        class="mb-4" />

      <div class="flex flex-col gap-4 max-w-[600px] px-[10px]">
        <UFormGroup label="Chapter Title" required>
          <UInput v-model="title"
            placeholder="Chapter Title" />
        </UFormGroup>

        <UFormGroup label="Chapter Type" required>
          <USelect v-model="chapterType"
            placeholder="Chapter Type" 
            :options="chapterTypes" />
        </UFormGroup>

        <UFormGroup label="Can Buyer Edit" required>
          <USelect v-model="canBuyerEdit"
            :options="canBuyerEditOptions" />
        </UFormGroup>
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
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { concat, filter, find, map } = lodash_pkg;

const route = useRoute()
const swaypageId = parseInt(route.params.id)
const chapterId = parseInt(route.params.page)

const swaypageStore = useSwaypagesStore()
const { 
  getSwaypageByIdCached, 
  getSwaypageChaptersByIdCached, 
} = storeToRefs(swaypageStore)

const [swaypage, chapters] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypageChaptersByIdCached.value(swaypageId),
])

const { 
  makeInternalSwaypageLink, 
  makeSwaypageChapterSettingsLink,
} = useSwaypageLinks()

const { getSwaypageTypeIcon } = useSwayageIcons()

const links = computed(() => filter(
  concat(
    [{
      label: 'Swaypage',
      icon: 'i-heroicons-document',
      to: makeInternalSwaypageLink(swaypage, 'settings')
    }], 
    swaypage.roomType === 'template' ? {
      label: 'Variables',
      icon: 'i-heroicons-variable',
      to: makeInternalSwaypageLink(swaypage, 'variables')
    } : null,
    map(chapters, (chapter) => ({
      label: chapter.title,
      icon: getSwaypageTypeIcon(chapter.pageType),
      to: makeSwaypageChapterSettingsLink(swaypage, chapter.id)
    }))),
    x => x
))

const chapter = find(chapters, c => c.id === chapterId)

const title = ref(chapter.title)
const canBuyerEdit = ref(chapter.canBuyerEdit ? 'Yes' : 'No')
const canBuyerEditOptions = ['Yes', 'No']

const chapterType = ref(chapter.pageType)
const chapterTypes = [
  {
    label: 'General Chapter',
    value: 'general',
  }, {
    label: 'Follow-up Chapter',
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
  await swaypageStore.updateChapter({
    swaypageId: swaypageId,
    chapterId: chapter.id,
    chapter: {
      title,
      pageType: chapterType,
      canBuyerEdit: canBuyerEdit.value === 'Yes',
    },
  })
})

const needsMoreInput = computed(() => !title.value 
  || !chapterType.value || !canBuyerEdit.value)
</script>
