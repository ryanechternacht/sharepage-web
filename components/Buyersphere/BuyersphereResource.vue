<template>
  <div class="flex flex-row gap-x-2">
    <div class="resource flex-grow">
      <img src="/svg/notebook.svg" class="resource-icon">
      <h3 class="resource-title">{{ resource.title }}</h3>
      <div class="resource-tags">
        <Tag color="teal" height="12px" width="80px">Public</Tag>
        <Tag color="gray" height="12px" width="80px">{{ formatDate(resource.createdat) }}</Tag>
      </div>
      <div class="resource-view">
        <BsButton v-if="editing"
          big
          color="teal"
          @click="save">Save</BsButton>
          <!-- navigateTo helper isn't respecting _blank -->
          <a
            v-else
            class="cursor-pointer px-6 rounded-md border border-gray-light py-1"
            target="_blank"
            :href="resource.link">View</a>
      </div>
    </div>

    <!-- TODO get these to show/hide on hover -->
    <img 
      src="/svg/edit.svg" 
      class="row-icon"
      @click="edit"
    >
    <img 
      src="/svg/trash.svg" 
      class="row-icon"
      @click="emit('delete:resource', { resourceId: r.id })">
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash'
const  { cloneDeep } = lodash_pkg

const { resource } = defineProps({ resource: Object })

const emit = defineEmits(['update:resource', 'delete:resource'])

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}

const editing = ref(false)
const editedTitle = ref('')
const editedLink = ref('')

function edit () {
  editing.value = true
  editedTitle.value = resource.title
  editedLink.value = link.title
}

function save () {
  const clone = cloneDeep(resource)
  clone.title = editedTitle.value
  clone.link = editedLink.value

  emit('update:resource', { resource: clone })
  editing.value = false;
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
  @apply my-auto;
  grid-area: view;
}

.row-icon {
  @apply p-2;
}
</style>