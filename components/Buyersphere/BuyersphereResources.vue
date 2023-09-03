<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-row items-center gap-x-2">
      <h3>Resources</h3>
      <BsButton v-if="editing" color="teal" @click="editing = false">
        Save Edits
      </BsButton>
      <template v-else>
        <BsButton @click="addNew = true">+ add</BsButton>
      </template>
    </div>

    <BuyersphereResource v-for="r in resources" 
      :resource="r" />

    <!-- <div v-if="editing"
      class="resource">
      <img src="/svg/notebook.svg" class="resource-icon">
      <input class="resource-title"
        placeholder="Resource Title"
        v-model="newResourceTitle">
      <div class="resource-tags">new</div>
      <a class="resource-view" 
        target="_blank" 
        color="teal">Add This Resource</a>
    </div> -->
  </div>
</template>

<script setup>
const { resources } = defineProps({ resources: Array })

const editing = ref(false)

</script>

<style lang="postcss" scoped>
</style>