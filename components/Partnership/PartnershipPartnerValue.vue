<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>What {{ partner.name }} Does</h3>
      <span class="partner-content">
        {{ partner?.partnerValue?.whatTheyDo }}
      </span>
    </section>
      
    <section>
      <h3>Why Customers Love {{ partner.name }}</h3>
      <EditableList
        :items="partner?.partnerValue?.whyTheyAreLoved"
        :edit="edit"
        @input="whyTheyAreLovedChanged"
        />
    </section>

    <section>
      <h3>Core Solutions</h3>
      <EditableList
        :items="partner?.partnerValue?.coreSolutions"
        :edit="edit"
        @input="coreSolutionsChanged"
        />
    </section>

    <section>
      <h3>Personas</h3>
      <EditableList
        :items="partner?.partnerValue?.personas"
        :edit="edit"
        @input="personasChanged"
        />
    </section>

  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';

const props = defineProps({
  partner: Object,
  edit: Boolean
})

const emit = defineEmits(['partnerValueChanged'])

function whyTheyAreLovedChanged (newValue) {
  const newObj = cloneDeep(props.partner.partnerValue);
  newObj.whyTheyAreLoved = newValue
  emit('partnerValueChanged', newObj)
}

function coreSolutionsChanged (newValue) {
  const newObj = cloneDeep(props.partner.partnerValue);
  newObj.coreSolutions = newValue
  emit('partnerValueChanged', newObj)
}

function personasChanged (newValue) {
  const newObj = cloneDeep(props.partner.partnerValue);
  newObj.personas = newValue
  emit('partnerValueChanged', newObj)
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.partner-content {
  @apply text-gray-600 text-sm;
}

ul {
  @apply list-disc list-outside ml-4;
}
</style>