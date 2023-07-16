<template>
  <div 
    class="flex flex-col gap-y-4"
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
  >
    <div>
      <h3>A message from Rickard Stark</h3>
      <div>{{ introMessage }}</div>

    </div>

    <div>
      <h3>🚀 Who our product serves:</h3>
      <div>
        <ul>
          <li v-for="p in personas">
            <span class="font-bold">{{ p.title }}:</span>
            {{ p.description }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <h3>✅ The problems we solve:</h3>
      <div>
        <ul>
          <li v-for="pp in painPoints">
            <span class="font-bold">{{ pp.title }}:</span>
            {{ pp.description }}
          </li>
        </ul>
      </div>
    </div>
    
    <div>
      <h3>📓 Resources to help you qualify if Seismic is right for you</h3>
    </div>

    <!-- TODO get this styling less intrusive -->
    <!-- <div
      class="flex flex-row-reverse w-full items-center gap-x-2 h-[2em] mb-[-2em]"
    >
    </div> -->
      <!-- <template v-if="isMouseOver">
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
    </template> -->
  </div>
</template>

<script setup>
import { usePainPointsStore } from '@/stores/pain-points'
import { usePersonasStore } from '@/stores/personas'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash'

const props = defineProps({ introMessage: String })

// TODO do these in parallel?
const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const personasStore = usePersonasStore()
const { getPersonasCached } = storeToRefs(personasStore)

const [painPoints, personas] = await Promise.all([
  getPainPointsCached.value(),
  getPersonasCached.value()
])

// const emit = defineEmits(['update:overview'])

// const isEditing = ref(false)
// const myOverview = ref(props.overview)
// const isMouseOver = ref(false)

// function updateText (i, newValue) {
//   // TODO expand to allow editing of the prompt too
//   myOverview.value.questions[i].answer.text = newValue
// }

// function updateItems (i, newValue) {
//   myOverview.value.questions[i].answer.items = newValue
// }

// watch(props, (newProps) => {
//   myOverview.value = cloneDeep(newProps.overview)
// })

// function edit () {
//   isEditing.value = true
// }

// function cancel () {
//   myOverview.value = cloneDeep(props.overview)
//   isEditing.value = false
// }

// function save () {
//   emit('update:overview', myOverview.value);
//   isEditing.value = false
// }
</script>

<style lang="postcss" scoped>
h3 {
  @apply mb-2;
}

li {
  @apply list-disc list-inside;
}
</style>
