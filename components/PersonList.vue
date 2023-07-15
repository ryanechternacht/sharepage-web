<template>
  <div class="flex flex-col gap-y-2">
    <div v-for="p in people" class="flex flex-row gap-x-4 items-center">
      <LetterAvatar :letter="p.name[0]" />
      <div class="flex flex-col">
        <p class="gray">{{ p.name }}</p>
        <p class="gray-italic">{{ p.displayRole }}</p>
      </div>
      <div class="flex-grow" />
      <!-- <a v-if="p.linkedIn" :href="p.linkedIn" target="_blank">
        <img src="/svg/linkedin.svg" />
      </a> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ people: Array})
</script>

<style lang="postcss" scoped>
</style>