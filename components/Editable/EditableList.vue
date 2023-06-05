<template>
  <div>
    <ul v-if="edit" class="edit">
      <li v-for="(_, index) in innerItems">
        <div class="flex flex-row items-center">
          <!-- I'd love to make these autogrow -->
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
            @blur="addNewItem" />
          <div class="w-[40px]" />
        </div>
      </li>
    </ul>
    <ul v-else class="view">
      <li v-for="item in items">
          <span class="partner-content">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { clone, remove } from 'lodash';

const props = defineProps({
  items: Array,
  edit: Boolean
})

const innerItems = ref([])

watch(props, (newProps) => {
  if (newProps.edit) {
    innerItems.value = [...newProps.items]
  }
})

onMounted(() => {
  innerItems.value = [...props.items]
})

const emit = defineEmits(['input'])

function inputChanged (newValue, index) {
  const newObject = clone(innerItems.value)
  newObject[index] = newValue
  emit('input', newObject)
}

function removeIndex(i) {
  // innerItems.value = [...innerItems.value.slice(0, i), ...innerItems.value.slice(i + 1)]
  emit('input', [...innerItems.value.slice(0, i), ...innerItems.value.slice(i + 1)])
}

const newItem = ref('')
function addNewItem() {
  if (newItem.value) {
    innerItems.value = [...innerItems.value, newItem.value]
    newItem.value = ''
    console.log(innerItems.value)
    emit('input', innerItems.value)
  }
}
</script>

<style lang="postcss" scoped>
ul.edit {
  @apply list-disc list-outside ml-4;

  textarea {
    @apply w-full text-sm border-b-[1.5px] border-gray-300  
      align-text-top text-gray-700 mb-1 w-full;
  }
}


ul.view {
  @apply list-disc list-outside ml-4;
}

span.partner-content {
  @apply text-gray-600 text-sm;
}
</style>