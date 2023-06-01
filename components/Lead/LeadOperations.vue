<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col">
        <h3>Account Owners</h3>
        <PersonRow
          v-for="o in lead?.operations?.owners"
          :key="o.name"
          :person="o" />
      </div>
      <div class="flex flex-col">
        <h3>Contributors</h3>
        <PersonRow
          v-for="c in lead?.operations?.contributors"
          :key="c.name"
          :person="c" />
      </div>
    </div>
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
</style>