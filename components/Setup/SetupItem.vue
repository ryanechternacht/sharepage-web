<template>
  <div class="flex flex-row gap-x-1">
    <div class="flex-grow">
      <div v-if="editing" class="flex flex-col gap-y-1 w-full">
        <slot name="editing" :item="copy" :update-item="updateItem">
          <input 
            :value="item.title"
            class="w-full"
            placeholder="Add Persona Title"
            @blur="ev => updateItem('title', ev.target.value)">
          <input
            :value="item.description"
            class="w-full"
            placeholder="Add Persona One Line Description"
            @blur="ev => updateItem('description', ev.target.value)">
        </slot>
      </div>
      <div v-else>
        <slot name="display" :item="item" :index="index">
          <span class="font-bold">{{ item.title }}: </span>
          <span>{{ item.description }}</span>
        </slot>
      </div>
    </div>
    <div class="ml-3 cursor-pointer min-w-[1rem]">
      <div v-if="editing" @click="commitChanges">✔️</div>
      <img v-else @click="startEditing" src="/svg/edit.svg">
    </div>
    <div class="cursor-pointer min-w-[1rem]">
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

const props = defineProps({ 
  item: Object, 
  index: Number
})
const emit = defineEmits(['updateItem', 'deleteItem'])
const copy = ref(null)

const editing = ref(false)

function startEditing () {
  copy.value = cloneDeep(props.item)
  editing.value = true
}

function updateItem (field, value) {
  copy.value[field] = value
}

function commitChanges() {
  emit('updateItem', { item: copy.value })
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
</style>
