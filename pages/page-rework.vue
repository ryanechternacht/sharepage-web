<template>
  <div class="m-10">
    <VueDraggable
      v-model="body.sections"
      ghost-class="ghost"
      :animation="200"
      :scroll="true"
      class="flex flex-col gap-2"
      group="sections"
      handle=".drag-handle"
    >
      <PageTextArea v-for="(section, index) in body.sections"
          v-model="section.body.question"
          @delete:item="removeItem(index)" />
    </VueDraggable>

    <br>
    <br>
    <br>
    {{ body }}
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import { VueDraggable } from 'vue-draggable-plus'
import lodash_pkg from 'lodash';
const { cloneDeep, find } = lodash_pkg;

const swaypageId = 76

const swaypageStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(swaypageStore)

const [swaypage, pages] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
])

const pageId = 88
const page = pageId
  ? find(pages, p => p.id === pageId)
  : first(pages)

const body = ref(cloneDeep(page.body))

function removeItem (index) {
  console.log('remove item', index)
  body.value.sections.splice(index, 1)
}
</script>

<style lang="postcss" scoped>
</style>