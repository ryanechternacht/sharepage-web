<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>Why We Partner</h3>
      <span class="partner-content">
        {{ partner?.jointValue?.whyWePartner }}
      </span>
    </section>

    <section>
      <h3>Key Features</h3>
      <EditableList
        :items="partner?.jointValue?.keyFeatures"
        :edit="edit"
        @input="keyFeaturesChanged"
        />
    </section>

    <section>
      <h3>How we work together</h3>
      <EditableList
        :items="partner?.jointValue?.howWeWorkTogether"
        :edit="edit"
        />
    </section>
  </div>
</template>

<script setup>
import { clone } from 'lodash';

const props = defineProps({
  partner: Object,
  edit: Boolean
})

const emit = defineEmits(['jointValueChanged'])

function keyFeaturesChanged (newValue) {
  const newObj = clone(props.partner.jointValue);
  newObj.keyFeatures = newValue
  emit('jointValueChanged', newObj)
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.partner-content {
  @apply text-gray-600 text-sm;
}
</style>
