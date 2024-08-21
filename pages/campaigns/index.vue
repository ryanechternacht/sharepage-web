<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton
          icon="i-heroicons-paper-airplane"
          to="/campaigns/new">
          New
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <h1>Campaigns</h1>
      <div class="w-full flex flex-row justify-end gap-2">
        <UInput v-model="searchTerm"
          icon="i-heroicons-magnifying-glass"
          class="my-2"
          placeholder="Search Campaigns" />
      </div>
      <UTable :rows :columns @select="goToCampaign">
        <template #isPublished-data="{ row }">
          {{ row.isPublished ? "Published" : "Pending Publication" }}
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span v-if="searchTerm" class="italic subtext">No campaigns match the filter</span>
            <span v-else class="italic subtext">No campaigns, yet!</span>
            <UButton label="Create a Campaign" 
              icon="i-heroicons-paper-airplane"
              to="/campaigns/new" />
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter } = lodash_pkg;

const { apiFetch } = useNuxtApp()
const { data: campaigns } = await apiFetch('/v0.1/campaigns')

const searchTerm = ref('')

const rows = computed(() => 
  filter(campaigns.value, c => c.title.toLowerCase().includes(searchTerm.value.toLowerCase())))

const columns = [{
  label: 'Title',
  key: 'title',
  sortable: true,
}, {
  label: 'Leads',
  key: 'leadCount',
  sortable: true,
}, {
  label: 'Is Published',
  key: 'isPublished',
  sortable: true,
}]

async function goToCampaign(c) {
  await navigateTo(`/campaigns/${c.uuid}`)
}
</script>

<style lang="postcss" scoped>
.campaign-grid {
  @apply grid px-8 gap-x-8 border border-gray-200 rounded-md overflow-hidden;
  grid-template-columns: repeat(3, 1fr);
}

.cell {
  @apply py-2 relative flex flex-row items-center gap-2;

  &::after {
    @apply absolute bg-gray-200 h-[1px] w-screen;
    content: '';
    inset-inline-start: -5rem;
    inset-block-start: 0;
  }
}
</style>
