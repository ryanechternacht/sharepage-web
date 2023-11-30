<template>
  <div class="flex flex-row gap-x-1">
    <div class="note flex-grow">
      <img src="/svg/yellow-notebook.svg" class="note-icon">
      <div class="note-mid-higher">
        <input v-if="editing"
          v-model="editedTitle"
          class="w-full"
          placeholder="Note Title">
        <h3 v-else>{{ note.title }}</h3>
      </div>
      <div class="note-mid-lower">
        <div v-if="!editing" 
          class="flex flex-row gap-x-2">
          <Tag color="teal" 
            height=".75rem" 
            width="5rem">
            Public
          </Tag>
          <Tag color="gray" 
            height=".75rem"
            class="min-w-[80px]">
            From {{ note.author.firstName }} {{ note.author.lastName.substring(0, 1) }}
          </Tag>
          <Tag color="gray" 
            height=".75rem" 
            width="5rem">
            {{ formatDate(note.createdAt) }}
          </Tag>
        </div>
      </div>
      <div class="note-view-button">
        <BsButton v-if="editing"
          big
          color="teal"
          @click="save">Save</BsButton>
        <BsButton v-else-if="viewing"
          big
          @click="viewing = false">Close</BsButton>
        <BsButton v-else
          big
          @click="viewing = true">View</BsButton>
      </div>
      <TipTapTextarea v-if="editing"
        v-model="editedBody" 
        class="note-bottom"/>
      <div v-else-if="viewing"
        v-html="note.body" 
        class="inline-html note-bottom rounded-md bg-gray-hover p-1" />
    </div>

    <!-- TODO get these to show/hide on hover -->
    <img v-if="editing"
      src="/svg/x.svg"
      class="row-icon"
      @click="dismissEdit">
    <img v-else
      src="/svg/edit.svg"
      class="row-icon"
      @click="edit">
    <img
      src="/svg/trash.svg"
      class="row-icon"
      @click="deleteNote">
  </div>
</template>

<script setup>
const props = defineProps({ note: Object })
const emit = defineEmits(['update:note', 'delete:note', 'dismiss-create'])

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM D')
}

const editing = ref(false)
const editedTitle = ref('')
const editedBody = ref('')
const viewing = ref(false)

function edit () {
  editing.value = true
  editedTitle.value = props.note.title
  editedBody.value = props.note.body
}

function save () {
  emit('update:note', { 
    noteId: props.note.id,
    title: editedTitle.value, 
    body: editedBody.value,
  })
  editing.value = false;
}

function dismissEdit () {
  editing.value = false;
}

function deleteNote () {
  const c = confirm('Are you sure you want to delete this note?')

  if (c) {
    emit('delete:note', { noteId: props.note.id })
  }
}
</script>

<style lang="postcss" scoped>
.note {
  @apply grid border border-gray-hover-active rounded-md p-2;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "icon mid-higher view-button"
    "icon mid-lower view-button"
    "bottom bottom bottom";
}

.note-icon {
  @apply mr-2 p-1 my-auto;
  grid-area: icon;
}

.note-mid-higher {
  @apply mr-2 mb-.5;
  grid-area: mid-higher;
}

.note-mid-lower {
  @apply mr-2;
  grid-area: mid-lower;
}

.note-view-button {
  @apply my-auto;
  grid-area: view-button;
}

.row-icon {
  @apply p-1 cursor-pointer max-w-[1.5rem];
}

.note-bottom {
  @apply mt-2;
  grid-area: bottom;
}
</style>