<template>
  <div>
    <ul v-if="edit" class="edit">
      <li 
        v-for="(item, index) in items"
        class="mb-2">
        <div class="flex flex-row">
          <!-- TODO I'd love to make these autogrow -->
          <textarea 
            :value="item"
            @blur="inputChanged($event.target.value, index)" />
          <div class="w-[40px] flex flex-col items-center self-center">
            <PButton @click="removeIndex(index)">X</PButton>
          </div>
        </div>
      </li>
      <li>
        <div class="flex flex-row">
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
import lodash_pkg from 'lodash';
const { groupBy } = lodash_pkg;

const props = defineProps({
  items: Array,
  edit: Boolean
})

const emit = defineEmits(['update:items'])

function inputChanged (newValue, index) {
  const newItems = cloneDeep(props.items)
  newItems[index] = newValue
  emit('update:items', newItems)
}

function removeIndex(i) {
  emit('update:items', [...props.items.slice(0, i), ...props.items.slice(i + 1)])
}

const newItem = ref('')
function addNewItem() {
  if (newItem.value) {
    emit('update:items', [...props.items, newItem.value])
    newItem.value = ''
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