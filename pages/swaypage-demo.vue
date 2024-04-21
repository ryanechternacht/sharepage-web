<template>
  <div>
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
</template>

<script setup>
definePageMeta({
  layout: 'swaypage'
})
</script>

<style lang="postcss" scoped>
</style>
