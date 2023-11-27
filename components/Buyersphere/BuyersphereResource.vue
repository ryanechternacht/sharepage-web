<template>
  <div class="flex flex-row gap-x-1">
    <div class="resource flex-grow">
      <img src="/svg/notebook.svg" class="resource-icon">
      <div class="resource-mid-higher">
        <input v-if="editing"
          v-model="editedTitle"
          class="w-full"
          placeholder="Resource Title">
        <h3 v-else>{{ resource.title }}</h3>
      </div>
      <div class="resource-mid-lower">
        <input v-if="editing"
          v-model="editedLink"
          class="w-full"
          placeholder="Resource Link">
        <div v-else class="flex flex-row gap-x-2">
          <Tag color="teal" height="12px" width="80px">Public</Tag>
          <Tag color="gray" height="12px" width="80px">{{ formatDate(resource.createdat) }}</Tag>
        </div>
      </div>
      <div class="resource-view">
        <BsButton v-if="editing"
          big
          color="teal"
          @click="save">Save</BsButton>
          <!-- navigateTo helper isn't respecting _blank -->
          <a v-else
            class="cursor-pointer px-6 rounded-md border border-gray-hover-active py-1"
            target="_blank"
            :href="resource.link">View</a>
      </div>
    </div>

    <!-- TODO get these to show/hide on hover -->
    <img v-if="editing"
      src="/svg/x.svg"
      class="row-icon"
      @click="dismissEdit">
    <img v-else
      src="/svg/edit.svg"
      class="row-icon"
      @click="edit"
    >
    <img
      src="/svg/trash.svg"
      class="row-icon"
      @click="deleteResource">
  </div>
</template>

<script setup>
const props = defineProps({ resource: Object, creating: Boolean })
const emit = defineEmits(['update:resource', 'delete:resource', 'dismiss-create'])

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}

const editing = ref(!!props.creating)
const editedTitle = ref('')
const editedLink = ref('')

function edit () {
  editing.value = true
  editedTitle.value = props.resource.title
  editedLink.value = props.resource.link
}

function save () {
  if (props.creating) {
    emit('update:resource', { 
      title: editedTitle.value, 
      link: editedLink.value,
    })
  } else {
    emit('update:resource', { 
      resourceId: props.resource.id,
      title: editedTitle.value, 
      link: editedLink.value,
    })
    editing.value = false;
  }
}

function dismissEdit () {
  if (props.creating) {
    emit('dismiss-create')
  } else {
    editing.value = false;
  }
}

function deleteResource () {
  if (props.creating) {
    emit('dismiss-create')
    return
  }

  const c = confirm('Are you sure you want to delete this resource?')

  if (c) {
    emit('delete:resource', { resourceId: props.resource.id })
  }
}
</script>

<style lang="postcss" scoped>
.resource {
  @apply grid border border-gray-hover-active rounded-md p-2;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "icon mid-higher view"
    "icon mid-lower view";
}

.resource-icon {
  @apply mr-2 p-1 my-auto;
  grid-area: icon;
}

.resource-mid-higher {
  @apply mr-2 mb-.5;
  grid-area: mid-higher;
}

.resource-mid-lower {
  @apply mr-2;
  grid-area: mid-lower;
}

.resource-view {
  @apply my-auto;
  grid-area: view;
}

.row-icon {
  @apply p-1 cursor-pointer max-w-[1.5rem];
}
</style>