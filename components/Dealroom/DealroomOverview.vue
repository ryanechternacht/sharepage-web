<template>
  <div 
    class="flex flex-col gap-y-4"
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
  >
    <!-- TODO get this styling less intrusive -->
    <div
      class="flex flex-row-reverse w-full items-center gap-x-2 h-[2em] mb-[-2em]"
    >
      <template v-if="isMouseOver">
        <PButton
          v-if="!isEditing"
          @click="edit"
          variant="gray-light">
          ✏️ Edit
        </PButton>
        <template v-else>
          <PButton 
            @click="save"
            variant="gray-light">
            💾 Save
          </PButton>
          <PButton 
            @click="cancel"
            variant="gray-light">
            ❌ Cancel
          </PButton>
        </template>
      </template>
    </div>
    <template
      v-for="(s, i) in myOverview?.questions"
    >
      <div>
        <h3>{{ s.question }}</h3>
        <EditableTextarea
          v-if="s.type === 'text'"
          :text="s.answer.text"
          :edit="isEditing"
          @update:text="updateText(i, $event)"
        />
        <EditableList
          v-if="s.type === 'list'"
          :items="s.answer.items"
          :edit="isEditing"
          @update:items="updateItems(i, $event)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';

const props = defineProps({ overview: Object })
const emit = defineEmits(['update:overview'])

const isEditing = ref(false)
const myOverview = ref(props.overview)
const isMouseOver = ref(false)

function updateText (i, newValue) {
  // TODO expand to allow editing of the prompt too
  myOverview.value.questions[i].answer.text = newValue
}

function updateItems (i, newValue) {
  myOverview.value.questions[i].answer.items = newValue
}

watch(props, (newProps) => {
  myOverview.value = cloneDeep(newProps.overview)
})

function edit () {
  isEditing.value = true
}

function cancel () {
  myOverview.value = cloneDeep(props.overview)
  isEditing.value = false
}

function save () {
  emit('update:overview', myOverview.value);
  isEditing.value = false
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply mb-2;
}
</style>
