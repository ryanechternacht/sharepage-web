<template>
  <div class="features-grid">
    <div class="flex flex-cols justify-center gap-x-6 items-center h-full">
      <div class="tag gray">Yes</div>
      <div class="tag gray">Maybe</div>
      <div class="tag gray">No</div>
    </div>

    <h3 class="gray italic text-center">Select what features you would like to explore</h3>
    <template v-for="(f, i) in featureList.questions">
      <div class="flex flex-cols justify-center gap-x-2 h-full">
        <PButton 
          variant="gray-light"
          size="large"
          :selected="myFeatures.features[i] === 'yes'"
          @click="myFeatures.features[i] = 'yes'">✅</PButton>
        <PButton 
          variant="gray-light"
          size="large"
          :selected="myFeatures.features[i] === 'maybe'"
          @click="myFeatures.features[i] = 'maybe'">🚧</PButton>
        <PButton 
          variant="gray-light"
          size="large"
          :selected="myFeatures.features[i] === 'no'"
          @click="myFeatures.features[i] = 'no'">⛔</PButton>
      </div>
      <div>
        <h3 class="leading-[2.5rem]" :class="[testClass]">Feature #{{ i + 1 }} {{ f.question }}</h3>
        <div class="gray">{{ f.answer.text }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { cloneDeep } from 'lodash';
const props = defineProps({ 
  featureList: Array, 
  features: Object 
})

// TODO fire this up as an event
const myFeatures = ref(cloneDeep(props.features))

</script>

<style lang="postcss" scoped>
.features-grid {
  @apply grid gap-x-6 gap-y-3;
  grid-template-columns: auto 1fr;
}
</style>
