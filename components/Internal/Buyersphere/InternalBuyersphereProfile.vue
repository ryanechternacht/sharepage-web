<template>
  <div class="page-left">
    <div class="sticky top-[2rem] p-2 flex flex-col gap-1 bg-gray-lightest border border-gray-lighter rounded-md"
      v-scroll-spy-active
      v-scroll-spy-link>

      <!-- The nested div is so scrollspy works correclty with the hrs -->
      <div>
        <div @click="navigateTo('#introduction')"
          class="page-link">👋 &nbsp; Introduction</div>
      </div>
      <div>
        <hr>
        <div @click="navigateTo('#personas')"
        class="page-link">🥸 &nbsp; Personas</div>
      </div>
      <div>
        <div @click="navigateTo('#solution')"
          class="page-link">🚀 &nbsp; Solution</div>
      </div>
      <div>
        <div @click="navigateTo('#features')"
          class="page-link">🤖 &nbsp; Features</div>
      </div>
      <div>
        <div v-if="buyersphere.showPricing"
          @click="navigateTo('#pricing')"
          class="page-link">💵 &nbsp; Pricing</div>
      </div>
      <div>
        <hr>
        <div @click="navigateTo('#notes')"
          class="page-link">📒 &nbsp; Notes</div>
      </div>
      <div>
        <div @click="navigateTo('#resources')"
          class="page-link">📓 &nbsp; Resources</div>
      </div>
    </div>
  </div>
  <div class="page-center" v-scroll-spy>
    <div style="height: 400px" id="introduction">Introduction</div>
    <div style="height: 400px" id="personas">Personas</div>
    <div style="height: 400px" id="solution">Solution</div>
    <div style="height: 400px" id="features">Features</div>
    <div v-if="buyersphere.showPricing" style="height: 400px" id="pricing">Pricing</div>
    <div style="height: 400px" id="notes">Notes</div>
    <div style="height: 400px" id="resources">Resources</div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { storeToRefs } from 'pinia'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached } = storeToRefs(buyersphereStore)

const [buyersphere] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
])

// function makeInternalBuyersphereLink(section) {
//   return section === 'map'
//     ? `/internal/buyersphere/${route.params.id}`
//     : `/internal/buyersphere/${route.params.id}/${section}`
// }
</script>

<style lang="postcss" scoped>
.page-left {
  @apply px-6;
  grid-area: left;
}

hr {
    @apply text-gray-lighter mt-1;
  }

.page-center {
  grid-area: center;
}

.page-link {
  @apply py-1 cursor-pointer;

  &:hover {
    @apply bg-gray-lighter rounded-md;
  }
}

.active .page-link {
  @apply bg-teal-primary rounded-md mx-[-.5rem] px-2 text-white;
}
</style>
