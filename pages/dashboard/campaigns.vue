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
      <div>
        <div class="flex flex-row items-center gap-4">
          <h1>Campaigns</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="postcss" scoped>

</style>
