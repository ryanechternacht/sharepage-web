<template>
  <div>
    <TopNav>
      <template #action-button>
        <UButton
          icon="i-heroicons-document"
          @click="openModal">
          New
        </UButton>
      </template>
    </TopNav>

    <div class="px-10 py-5">
      <UHorizontalNavigation :links="links">
        <template #default="{ link, isActive }">
          <div class="w-[2rem] h-[2rem] bg-blue-brand rounded-full"></div>
          <div>{{ link.label }}</div>
          {{ isActive }}
        </template>
      </UHorizontalNavigation>
    </div>
  </div>
</template>

<script setup>
const links = [{
  label: 'Setup',
  to: `/campaigns/new`
}, {
  label: 'Variables',
  to: '/campaigns/variables'
}, {
  label: 'AI Prompts',
  to: '/campaigns/ai-prompts'
}]
</script>

<style lang="postcss" scoped>

</style>
