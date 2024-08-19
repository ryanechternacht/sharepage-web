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
      <UTable :rows :columns @select="goToCampaign">
        <template #isPublished-data="{ row }">
          {{ row.isPublished ? "Published" : "Pending Publication" }}
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic subtext">No campaigns yet!</span>
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
const { apiFetch } = useNuxtApp()
const { data: d } = await apiFetch('/v0.1/campaigns')

const rows = ref([])

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
