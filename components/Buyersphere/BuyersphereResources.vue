<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-row items-center gap-x-2">
      <h3>Resources</h3>
      <BsButton @click="creating = true">+ add</BsButton>
    </div>

    <BuyersphereResource v-for="r in resources"
      :resource="r" 
      @update:resource="obj => emit('update:resource', obj)"
      @delete:resource="obj => emit('delete:resource', obj)" />

    <BuyersphereResource v-if="creating"
      :creating="true" 
      @update:resource="createResource"
      @dismiss-create="creating = false" />
  </div>
</template>

<script setup>
const { resources } = defineProps({ resources: Array })
const emit = defineEmits(['create:resource', 'update:resource', 'delete:resource'])

const creating = ref(false)

function createResource(obj) {
  emit('create:resource', obj)
  creating.value = false
}
</script>

<style lang="postcss" scoped>
</style>