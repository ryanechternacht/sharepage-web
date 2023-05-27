<template>
  <div>
    <div class="page-grid">
      <div class="">
        <div class="">
          <span class="text-3xl">🤝</span>
          <input type="text" placeholder="search" v-model="partnerFilter"
            class="border border-gray-400 rounded">
        </div>

        <div class="flex flex-col gap-y-2">
          <div v-for="p in partnerList" :key="p.name">
            <div class="w-full bg-slate-200 flex flex-row items-center p-2">
              <img :src="p.logo" class="h-8 w-8">
              <div class="text-md font-bold ml-4">{{ p.name  }}</div>
              <div v-if="p.new" class="italic ml-2 text-xs">New</div>

              <div class="flex-grow" />

              <div v-if="p.type" class="border-[#0500db] border-2 rounded text-xs text-[#0500db] p-[2px]">{{ p.type }}</div>
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
      <!-- fix this--> 
      <PartnershipDetails
        :partner="partners[0]" 
        class="flex-grow" />
    </div>
  </div>
</template>

<script setup>
  import { usePartnersStore } from '@/stores/partners'
  import { storeToRefs } from 'pinia'

  const { partners } = storeToRefs(usePartnersStore())

  const partnerFilter = ref('');

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
</style>