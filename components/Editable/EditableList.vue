<template>
  <div>
    <ul v-if="edit" class="edit">
      <li v-for="(item, index) in innerItems">
        <textarea 
          class="partner-content"
          :value="innerItems[index]"
          @blur="inputChanged($event.target.value, index)" />
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
import { clone } from 'lodash';

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
</script>

<style lang="postcss" scoped>
ul.edit {
  @apply list-disc list-outside ml-4;
}

textarea.partner-content {
  @apply w-full text-sm border border-gray-600 rounded-sm p-[1px];
}

ul.view {
  @apply list-disc list-outside ml-4;
}

span.partner-content {
  @apply text-gray-600 text-sm;
}
</style>