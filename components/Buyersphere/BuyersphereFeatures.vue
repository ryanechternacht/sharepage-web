<template>
  <div class="features-grid">
    <div class="flex flex-cols justify-center gap-x-6 items-center h-full">
      <div class="tag gray">Yes</div>
      <div class="tag gray">Maybe</div>
      <div class="tag gray">No</div>
    </div>

    <h3 class="gray italic text-center">Select what features you would like to explore</h3>
    <template v-for="(f, i) in globalFeatures">
      <div class="flex flex-cols justify-center gap-x-2 h-full">
        <PButton
          variant="gray"
          size="large"
          :selected="myFeatures?.interests[f.id] === 'yes'"
          @click="saveFeatureInterest(f.id, 'yes')">✅</PButton>
        <PButton
          variant="gray"
          size="large"
          :selected="myFeatures?.interests[f.id] === 'maybe'"
          @click="saveFeatureInterest(f.id, 'maybe')">🚧</PButton>
        <PButton
          variant="gray"
          size="large"
          :selected="myFeatures?.interests[f.id] === 'no'"
          @click="saveFeatureInterest(f.id, 'no')">⛔</PButton>
      </div>
      <div>
        <h3 class="leading-[2.5rem]">Feature #{{ i + 1 }} {{ f.title }}</h3>
        <div class="gray">{{ f.description }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useFeaturesStore } from '@/stores/features'
import { useBuyerspheresStore } from '@/stores/buyerspheres';
import { storeToRefs } from 'pinia';

const route = useRoute()
const buyersphereId = route.params.id

const store = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(store)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const [buyersphere, globalFeatures] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getFeaturesCached.value()
])

// is this worth doing for snappier UX? (probably)
const myFeatures = ref(buyersphere.featuresAnswer)

// TODO this should emit (not hit the store directly?)
function saveFeatureInterest (featureId, answer) {
  myFeatures.value.interests[featureId] = answer
  store.saveFeaturesAnswer({ buyersphereId, featuresAnswer: myFeatures })
}
</script>

<style lang="postcss" scoped>
.features-grid {
  @apply grid gap-x-6 gap-y-3;
  grid-template-columns: auto 1fr;
}
</style>
