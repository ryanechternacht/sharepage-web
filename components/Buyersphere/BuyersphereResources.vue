<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-row">
      <h3>Resources</h3>
    </div>

    <div v-for="r in resources"
      class="resource">
      <img src="/svg/notebook.svg" class="resource-icon">
      <h3 class="resource-title">{{ r.title }}</h3>
      <div class="resource-tags">
        <Tag color="teal" height="12px" width="80px">Public</Tag>
        <Tag color="gray" height="12px" width="80px">{{ formatDate(r.createdat) }}</Tag>
      </div>
      <a class="resource-view" target="_blank" :href="r.link">View!</a>
    </div>
  </div>
</template>

<script setup>
const { resources } = defineProps({ resources: Array })

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}
</script>

<style lang="postcss" scoped>
.resource {
  @apply grid border border-gray-light rounded-md p-2;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "icon title view"
    "icon tags view";
}

.resource-icon {
  @apply mr-2 p-1 my-auto;
  grid-area: icon;
}

.resource-title {
  grid-area: title;
}

.resource-tags {
  @apply flex flex-row gap-x-2;
  grid-area: tags;
}

.resource-view {
  @apply border border-gray-light py-1 px-4 my-auto;
  grid-area: view;
}
</style>