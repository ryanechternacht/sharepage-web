<template>
  <div>
    <div class="page-grid">
      <div class="">
        <div class="flex flex-row items-center">
          <span class="text-3xl">💎</span>
          <span class="ml-2 text-2xl">Leads</span>
          <div class="flex-grow" />
          <input type="text" placeholder="Quick Search" v-model="leadFilter"
            class="search-box">
        </div>

        <div class="flex flex-col gap-y-2 mt-4">
          <div 
            v-for="lead in leadList" 
            :key="lead.name"
            @click="selectedLead = lead"
            class="lead-item"
              :class="{selected: selectedLead === lead}"
            >
            <div class="lead-item-inner">
              <img :src="lead.logo" class="h-8 max-w-16">
              <div class="text-md font-bold">{{ lead.name  }}</div>
              <div v-if="lead.new" class="italic text-xs">New</div>

              <div class="flex-grow" />

              <div 
                v-for="tag in lead.tags"
                :key="tag"
                class="tag">
                {{ tag }}
              </div>
              <div class="">
                <span class="text-xs">
                  <span v-if="lead.approval.us && lead.approval.partner">🟢 Active</span>
                  <span v-else>🔴 Not Active</span>
                </span>
              </div>
            </div>  
          </div>
        </div>
      </div>
      <LeadDetails
        v-if="selectedLead"
        :lead="selectedLead" 
        class="flex-grow" />
    </div>
  </div>
</template>

<script setup>
import { useLeadsStore } from '@/stores/leads'
import { storeToRefs } from 'pinia'

const { leads } = storeToRefs(useLeadsStore())

const leadFilter = ref('');
const selectedLead = ref(null);

const leadList = computed(() => {
  return leadFilter.value
    ? leads.value.filter(p => p.name.toLowerCase().includes(partnerFilter.value.toLowerCase()))
    : leads.value
})
</script>

<style lang="postcss" scoped>
.page-grid {
  @apply grid gap-x-4;
  grid-template-columns: 400px minmax(0, 1fr);
}

.search-box {
  @apply border border-gray-400 rounded text-sm px-2;
}

.lead-item {
  @apply w-full bg-slate-200 py-2 px-4 rounded-lg;

  &.selected {
    @apply bg-[#0500db] text-white;
  }

  &:hover {
    @apply border-l-[#0500db] border-l-8;

    .lead-item-inner {
      margin-left: -8px;
    }
  }
}

.lead-item-inner {
  @apply flex flex-row items-center gap-2;
}

.tag {
  @apply border-[#0500db] border-2 rounded text-xs text-[#0500db] p-[2px];
}

.selected .tag {
  @apply border-white text-white;
}
</style>