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
      <div class="mt-2 campaign-grid">
        <h2 class="h-[3rem] flex flex-row items-center">Name</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Leads</h2>
        <h2 class="h-[3rem] flex flex-row items-center">Is Published</h2>

        <NuxtLink class="contents cursor-pointer group" v-for="campaign in campaigns"
          :to="`/campaigns/${campaign.uuid}`">
          <div class="cell body">
            {{ campaign.title }}
          </div>
          <div class="cell body">
            {{ campaign.leadCount }}
          </div>
          <div class="cell body">
            {{ campaign.isPublished ? "Published" : "Pending Publication" }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useNuxtApp()
const { data: campaigns } = await apiFetch('/v0.1/campaigns')
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
