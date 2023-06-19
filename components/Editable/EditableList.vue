<template>
  <div>
    <ul v-if="edit" class="edit">
      <li 
        v-for="(_, index) in innerItems"
        class="mb-2">
        <div class="flex flex-row items-center">
          <!-- TODO I'd love to make these autogrow -->
          <textarea 
            :value="innerItems[index]"
            @blur="inputChanged($event.target.value, index)" />
          <div class="w-[40px] flex flex-col items-center">
            <PButton @click="removeIndex(index)">X</PButton>
          </div>
        </div>
      </li>
      <li>
        <div class="flex flex-row items-center">
          <textarea
            v-model="newItem"
            placeholder="Add a new Row"
            @blur="addNewItem"
            @keyup.enter="addNewItem" />
          <div class="w-[40px]" />
        </div>
      </li>
    </ul>
    <ul v-else class="view">
      <li v-for="item in items">
        <span class="gray">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { clone } from 'lodash';

const props = defineProps({
  items: Array,
  edit: Boolean
})

const innerItems = ref([])

//TODO
// watch(props, (newProps) => {
//   if (newProps.edit) {
//     innerItems.value = [...newProps.items]
//   }
// })

onMounted(() => {
  innerItems.value = [...props.items]
})

const emit = defineEmits(['update:items'])

function inputChanged (newValue, index) {
  const newObject = clone(innerItems.value)
  newObject[index] = newValue
  emit('update:items', newObject)
}

function removeIndex(i) {
  emit('update:items', [...innerItems.value.slice(0, i), ...innerItems.value.slice(i + 1)])
}

const newItem = ref('')
function addNewItem() {
  if (newItem.value) {
    innerItems.value = [...innerItems.value, newItem.value]
    newItem.value = ''
    emit('update:items', innerItems.value)
  }
}
</script>

<style lang="postcss" scoped>
ul.edit {
  @apply list-disc list-outside ml-4;

  textarea {
    @apply w-full border-b border-gray align-text-top pb-1;

    &:focus-visible {
      @apply outline-0;
    }
  }
}


ul.view {
  @apply list-disc list-outside ml-4;
}
</style>