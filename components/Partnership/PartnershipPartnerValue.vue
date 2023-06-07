<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>What {{ partnerName }} Does</h3>
      <EditableTextarea
        :edit="edit" 
        :text="partnerValue?.whatTheyDo"
        @update:text="update($event, 'whatTheyDo')" />
    </section>
      
    <section>
      <h3>Why Customers Love {{ partnerName }}</h3>
      <EditableList
        :items="partnerValue?.whyTheyAreLoved"
        :edit="edit"
        @update:items="update($event, 'whyTheyAreLoved')"
        />
    </section>

    <section>
      <h3>Core Solutions</h3>
      <EditableList
        :items="partnerValue?.coreSolutions"
        :edit="edit"
        @update:items="update($event, 'coreSolutions')"
        />
    </section>

    <section>
      <h3>Personas</h3>
      <EditableList
        :items="partnerValue?.personas"
        :edit="edit"
        @update:items="update($event, 'personas')"
        />
    </section>

  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';

const props = defineProps({
  partnerValue: Object,
  edit: Boolean,
  partnerName: String
})

const emit = defineEmits(['update:partnerValue'])

function update(newValue, field) {
  const newObj = cloneDeep(props.partnerValue)
  newObj[field] = newValue
  emit('update:partnerValue', newObj)
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}

ul {
  @apply list-disc list-outside ml-4;
}
</style>