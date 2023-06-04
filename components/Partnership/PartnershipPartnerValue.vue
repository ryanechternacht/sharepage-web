<template>
  <div class="flex flex-col gap-4">
    <section>
      <h3>What {{ partner.name }} Does</h3>
      <span class="partner-content">
        {{ partner?.partnerValue?.whatTheyDo }}
      </span>
    </section>
      
    <section>
      <h3>Why Customers Love {{ partner.name }}</h3>
      <EditableList
        :items="partner?.partnerValue?.whyTheyAreLoved"
        :edit="edit"
        />
    </section>

    <section>
      <h3>Core Solutions</h3>
      <EditableList
        :items="partner?.partnerValue?.coreSolutions"
        :edit="edit"
        />
    </section>

    <section>
      <h3>Personas</h3>
      <EditableList
        :items="partner?.partnerValue?.personas"
        :edit="edit"
        />
    </section>

  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object
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