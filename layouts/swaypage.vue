<template>
  <div>
    <TopNav />
    <div class="page-grid">
      <div class="flex flex-col gap-2">
        <div>Pied Piper</div>
        <div>Feed</div>
        <div>Activities</div>
        <div>Page 1</div>
        <div>Page 2</div>
        <div>Page 3</div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
.page-grid {
  @apply mx-8 grid;
  /* TODO, I can probably improve these a bit using some minmax() */
  /* ideal is ~350 710 220 */
  grid-template-columns: 3fr 6.5fr 2fr;

  :deep() > :nth-child(2) {
    @apply border border-gray-border rounded-md px-2 py-1;
    /* TODO this is based on the current top nav height */
    min-height: calc(100vh - 5rem);
  }
}
</style>
