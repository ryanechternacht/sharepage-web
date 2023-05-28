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
      <ul class="list-disc list-inside">
        <li v-for="i in partner?.partnerValue?.whyTheyAreLoved"
          class="partner-content">{{ i }}</li>
      </ul>
    </section>

    <section>
      <h3>Core Solutions</h3>
      <ul class="list-disc list-inside">
        <li v-for="i in partner?.partnerValue?.coreSolutions"
          class="partner-content">{{ i }}</li>
      </ul>
    </section>

    <section>
      <h3>Personas</h3>
      <ul class="list-disc list-inside">
        <li v-for="i in partner?.partnerValue?.personas"
          class="partner-content">{{ i }}</li>
      </ul>
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
</style>