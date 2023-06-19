<template>
  <div class="flex flex-col gap-y-4">
    <!-- TODO get this styling less intrusive -->
    <div
      
      class="flex flex-row-reverse w-full gap-x-2"
      style="margin-bottom: -1rem"
    >
      <!-- TODO make this edit button work! -->
      <span 
        v-if="!isEditing"
        @click="edit"
      >
        edit
      </span>
      <template v-else>
        <span @click="save">save</span>
        <span @click="cancel">cancel</span>
      </template>
    </div>
    <template
      v-for="(s, i) in myOverview?.sections"
    >
      <div>
        <h3>{{ s.prompt }}</h3>
        <EditableTextarea
          v-if="s.type === 'text'"
          :text="s.answer"
          :edit="isEditing"
          @update:text="updateText(i, $event)"
        />
        <EditableList
          v-if="s.type === 'list'"
          :items="s.answers"
          :edit="isEditing"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';

const props = defineProps({ overview: Object })

const isEditing = ref(false)
const myOverview = ref(props.overview)

function updateText (i, newValue) {
  // TODO expand to allow editing of the prompt too
  myOverview.value.sections[i].answer = newValue
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

const emit = defineEmits('update:overview')

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
