<template>
  <div class="grid custom-subgrid col-span-2">
    <div class="center-area">
      <div v-for="a in [1, 2, 3]"
        class="h-[50vh]">
        I'm real page content!
      </div>
    </div>
    <div>
      <div class="sticky top-40">
        <div class="mt-40 flex flex-col gap-4 items-end">
          <div class="gray">Key Links</div>
          <div>Schedule a Call</div>
          <div>Connect on LinkedIn</div>
          <div>See our Testemonials</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'swaypage'
})
</script>

<style lang="postcss" scoped>
.center-area {
  @apply border border-gray-border rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
}

/* should be grid-cols-subgrid, but we need a newer tailwind */
.custom-subgrid {
  grid-template-columns: subgrid;
}
</style>
