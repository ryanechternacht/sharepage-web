<template>
  <div class="flex flex-row gap-x-1">
    <div class="flex-grow">
      <div v-if="editing" class="flex flex-col gap-y-1 w-full">
        <input 
          v-model="itemTitle"
          class="w-full"
          placeholder="Add Persona Title">
        <TipTapTextarea 
          v-if="featureMode"
          v-model="itemDescription"
          class="mt-1 w-full"
          placeholder="Add Feature Description" />
        <input
          v-else
          v-model="itemDescription"
          class="w-full"
          placeholder="Add Persona One Line Description">
      </div>
      <div v-else>
        <template v-if="featureMode">
          <h3 class="mb-1">Feature #{{ index + 1 }} {{ item.title }}</h3>
          <span class="gray inline-html" v-html="item.description" />
        </template>
        <template v-else>
          <span class="font-bold">{{ item.title }}: </span>
          <span>{{ item.description }}</span>
        </template>
      </div>
    </div>
    <div class="cursor-pointer">
      <div v-if="editing" @click="commitChanges">✔️</div>
      <img v-else @click="startEditing" src="/svg/edit.svg">
    </div>
    <div class="cursor-pointer">
      <img
        v-if="editing"
        src="/svg/trash.svg"
        @click="editing = false">
      <img 
        v-else
        src="/svg/trash.svg"
        @click="deleteItem">
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { cloneDeep } = lodash_pkg;

// "feature-mode" is the differential rendering for the features version
// it (and only it) also uses the index prop
const props = defineProps({ 
  item: Object, 
  featureMode: Boolean,
  index: Number
})
const emit = defineEmits(['updateItem', 'deleteItem'])

const editing = ref(false)
const itemTitle = ref(null)
const itemDescription = ref(null)

function startEditing () {
  itemTitle.value = props.item.title
  itemDescription.value = props.item.description
  editing.value = true
}

function commitChanges() {
  const clone = cloneDeep(props.item)
  clone.title = itemTitle.value
  clone.description = itemDescription.value
  emit('updateItem', { item: clone })
  editing.value = false;
}

function deleteItem() {
  const c = confirm("Are you sure you want to delete")

  if (c) {
    emit('deleteItem', { item: props.item })
  }
}
</script>

<style lang="postcss" scoped>
/* TODO should these be global? */
.inline-html :deep() p:first-child {
  display: inline;
}

.inline-html :deep() li p {
  display: inline;
}
</style>
