<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>Why We Partner</h3>
      <EditableTextarea
        :edit="edit" 
        :text="jointValue?.whyWePartner"
        @update:text="update($event, 'whyWePartner')" />
    </section>

    <section>
      <h3>Key Features</h3>
      <EditableList
        :items="jointValue?.keyFeatures"
        :edit="edit"
        @update:items="update($event, 'keyFeatures')"
        />
    </section>

    <section>
      <h3>How we work together</h3>
      <EditableList
        :items="jointValue?.howWeWorkTogether"
        :edit="edit"
        @update:items="update($event, 'howWeWorkTogether')"
        />
    </section>
  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';

const props = defineProps({
  edit: Boolean,
  jointValue: Object
})

const emit = defineEmits(['update:jointValue'])

function update(newValue, field) {
  const newObj = cloneDeep(props.jointValue)
  newObj[field] = newValue
  emit('update:jointValue', newObj)
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.partner-content {
  @apply text-gray text-sm;
}
</style>
