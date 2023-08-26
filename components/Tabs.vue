<template>
  <div class="flex flex-row gap-x-5 items-end">
    <PButton
      v-for="tab in tabs"
      variant="gray"
      :selected="tab === selectedTab"
      @click="clickHandler(tab)"
    >{{ tab }}</PButton>
  </div>
</template>

<script setup>
const props = defineProps({ tabs: Array, selectedTab: String })

const emits = defineEmits(['newTabSelected'])

function clickHandler (tab) {
  emits('newTabSelected', { tab })
}
</script>

<style lang="postcss" scoped>

</style>
