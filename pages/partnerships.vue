<template>
  <div>
    <div class="flex flex-row"><!-- this should be grid -->
      <div class="w-[300px]">
        <div class="flex flex-row justify-between">
          <span class="text-3xl">🤝</span>
          <input type="text" placeholder="search" v-model="partnerFilter"
            class="border border-gray-400 rounded">
        </div>

        <div class="flex flex-col gap-y-2">
          <div v-for="p in partnerList" :key="p.name">
            <div class="w-full bg-slate-200 flex flex-row items-center p-2">
              <div class="text-3xl">🏢</div> 
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
      <div class="flex-grow bg-red-500">
        Partner Content
      </div>
    </div>
  </div>
</template>

<script setup>
  const partners = [{
    name: 'Zendesk',
    type: 'Technology',
    state: 'Active'
  }, {
    name: 'Seismic',
    type: 'Strategic',
    state: 'Active'
  }, {
    name: 'Gong',
    state: 'Pending',
    new: true
  }, {
    name: 'Klayvio',
    state: 'In Progress'
  }, {
    name: 'Atlassian',
    state: 'Pending',
    new: true
  }]

  const partnerFilter = ref('');

  const partnerList = computed(() => {
    console.log(partnerFilter)
    return partnerFilter.value
      ? partners.filter(p => p.name.toLowerCase().includes(partnerFilter.value.toLowerCase()))
      : partners
  })
</script>

<script>
export default {
}
</script>

<style lang="postcss" scoped>
.page-grid {
  @apply grid;
}
</style>