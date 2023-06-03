<template>
  <div class="flex flex-col gap-4">
    {{ edit }}
    <section>
      <h3>Why We Partner</h3>
      <span class="partner-content">
        {{ partner?.jointValue?.whyWePartner }}
      </span>
    </section>

    <section>
      <h3>Key Features</h3>
      <EditableList
        :items="partner?.jointValue?.keyFeatures"
        :edit="edit"
        />
    </section>

    <section>
      <h3>How we work together</h3>
      <ul>
        <li v-for="i in partner?.jointValue?.howWeWorkTogether"
        class="partner-content">{{ i }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object,
  edit: Boolean
})
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}
.partner-content {
  @apply text-gray-600 text-sm;
}
</style>
