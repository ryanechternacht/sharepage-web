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
        :ui="{ base: 'max-w-[10rem]' }"
        class="mb-4" />

      <h2 class="mb-2 px-[10px]">Variable Labels</h2>
      <div class="variable-grid">
        <div class="subtext">account-name</div>
        <div class="body">Account Name</div>
        <div><!-- empty--></div>

        <div class="subtext">first-name</div>
        <div class="body">First Name</div>
        <div><!-- empty--></div>

        <div class="subtext">last-name</div>
        <div class="body">Last Name</div>
        <div><!-- empty--></div>

        <div class="subtext">email</div>
        <div class="body">Email</div>
        <div><!-- empty--></div>

        <div class="subtext">domain</div>
        <div class="body">Domain</div>
        <div><!-- empty--></div>

        <template v-for="(variable, index) in variables">
          <div class="subtext">field-{{ index + 1 }}</div>
          <UInput
            :model-value="variable"
            placeholder="Custom Variable Label"
            @update:model-value="v => variables[index] = v" />
          <div>
            <UButton v-if="index === variables.length - 1"
              icon="i-heroicons-trash"
              variant="outline"
              @click="variables.pop()">Remove</UButton>
          </div>
        </template>
        <div class="col-span-3">
          <UButton
            icon="i-heroicons-plus"
            variant="outline"
            @click="variables.push('')">Add Variable</UButton>
        </div>
      </div>

      <SubmitButton
        class="mt-8 ml-[10px]"
        icon="i-heroicons-pencil-square"
        :disabled="needsMoreInput"
        ready-text="Save"
        submitting-text="Savings"
        submitted-text="Saved"
        error-text="Try Again"
        :submissionState="submissionState"
        @click="submitFn" />
    </div>
  </div>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { clone, concat, filter, map, some } = lodash_pkg;

const route = useRoute()
const sharepageId = parseInt(route.params.id)

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

const variables = ref(clone(sharepage.templateCustomVariables))

const { submissionState, submitFn } = useSubmit(async () => {
  await sharepageStore.saveSharepageSettings({
    sharepageId: sharepage.id,
    templateCustomVariables: variables,
  })
})

const needsMoreInput = computed(() => some(variables.value, v => !v))
</script>

<style lang="postcss" scoped>
.variable-grid {
  @apply grid max-w-[600px] gap-4 items-center px-[10px];
  grid-template-columns: auto 1fr auto;
}

.page-area {
  @apply border border-gray-200 rounded-md px-2 pt-1 pb-4;
  /* this is based on the current top nav height */
  overflow: hidden;
}
</style>
