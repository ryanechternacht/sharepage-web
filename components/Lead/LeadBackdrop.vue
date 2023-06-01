<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>Context</h3>
      <ul>
        <li v-for="c in lead?.backdrop?.context"
        class="partner-content">{{ c }}</li>
      </ul>
    </section>

    <section>
      <h3>Incentives</h3>
      <ul>
        <li v-for="i in lead?.backdrop?.incentives"
        class="partner-content">{{ i }}</li>
      </ul>
    </section>

    <section>
      <h3>Concerns</h3>
      <ul>
        <li v-for="c in lead?.backdrop?.concerns"
        class="partner-content">{{ c }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  lead: Object
})
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.partner-content {
  @apply text-gray-600 text-sm;
}

ul {
  @apply list-disc list-outside ml-4;
}
</style>
