<template>
  <div>
    <div class="page-grid">
      <div class="">
        <div class="flex flex-row items-center">
          <span class="text-3xl">🤝</span>
          <span class="ml-2 text-2xl">Partnerships</span>
          <div class="flex-grow" />
          <input type="text" placeholder="Quick Search" v-model="partnerFilter"
            class="search-box">
        </div>

        <div class="flex flex-col gap-y-2 mt-4">
          <div 
            v-for="p in partnerList" 
            :key="p.name"
            @click="selectedPartner = p"
          >
            <div 
              class="partner-item"
              :class="{selected: selectedPartner === p}"
            >
              <img :src="p.logo" class="h-8 max-w-16">
              <div class="text-md font-bold ml-4">{{ p.name  }}</div>
              <div v-if="p.new" class="italic ml-2 text-xs">New</div>

              <div class="flex-grow" />

              <div v-if="p.type" class="tag">{{ p.type }}</div>
              <div class="ml-2">
                <span class="text-xs">
                  <span v-if="p.state === 'Active'">🟢</span>
                  <span v-else-if="p.state === 'In Progress'">🟡</span>
                  <span v-else>🔴</span>
                </span>
                <span class="text-sm pl-1">
                  {{ p.state }}
                </span>
              </div>
            </div>  
          </div>
        </div>
      </div>
      <PartnershipDetails
        v-if="selectedPartner"
        :partner="selectedPartner" 
        class="flex-grow" />
    </div>
  </div>
</template>

<script setup>
  import { usePartnersStore } from '@/stores/partners'
  import { storeToRefs } from 'pinia'

  const { partners } = storeToRefs(usePartnersStore())

  const partnerFilter = ref('');
  const selectedPartner = ref(null);

  const partnerList = computed(() => {
    return partnerFilter.value
      ? partners.value.filter(p => p.name.toLowerCase().includes(partnerFilter.value.toLowerCase()))
      : partners.value
  })
</script>

<script>
export default {
}
</script>

<style lang="postcss" scoped>
.page-grid {
  @apply grid gap-x-4;
  grid-template-columns: 400px minmax(0, 1fr);
}

.search-box {
  @apply border border-gray-400 rounded text-sm px-2;
}

.partner-item {
  @apply w-full bg-slate-200 flex flex-row items-center p-2 rounded-lg;
}

.partner-item.selected {
  @apply bg-[#0500db] text-white;
}

.tag {
  @apply border-[#0500db] border-2 rounded text-xs text-[#0500db] p-[2px];
}

.selected .tag {
  @apply border-white text-white;
}
</style>