<template>
  <div>
    <div class="flex flex-col gap-y-2">
      <h3>Create a new Note:</h3>
      <input
        v-model="noteTitle"
        ref="titleElem"
        class="w-full"
        placeholder="New Note Title"
        @keyup.enter="checkReady" >
      <TipTapTextarea 
        v-model="noteBody"
        ref="bodyElem"
        min-height="140px"
        placeholder="New Note Body" />
      <SubmitButton 
        class="w-[10rem] h-[2.5rem] self-center"
        :submission-state="submissionState"
        ready-text="Add New Note"
        submitting-text="Saving Note"
        submitted-text="Note Saved"
        @click="checkReady" />

      <h3 class="mt-10">Notes</h3>
      <BuyersphereNote v-for="n in notes"
        :note="n"
        @update:note="updateNote"
        @delete:note="deleteNote" />
    </div>
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres';
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia';

const { notes } = defineProps({ notes: Array })
const emit = defineEmits(['create:note', 'update:note', 'delete:note'])

const buyersphereStore = useBuyerspheresStore()

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const user = await getMeCached.value()

const route = useRoute()
const buyersphereId = route.params.id

const noteTitle = ref('')
const noteBody = ref('')
const titleElem = ref(null)
const bodyElem = ref(null)


const { submissionState, submitFn } = useSubmit(async () => 
  await buyersphereStore.createNote({
    title: noteTitle.value,
    body: noteBody.value,
    authorId: user.id,
    buyersphereId
  }))

async function checkReady() {
  if (noteTitle.value && noteBody.value) {
    submitFn()
    noteTitle.value = ''
    noteBody.value = ''
  } else if (!noteTitle.value) {
    titleElem.value.focus()
  } else {
    bodyElem.value.focus()
  }
}

function updateNote({ noteId, title, body }) {
  buyersphereStore.updateNote({ buyersphereId, noteId, title, body })
}

function deleteNote({ noteId }) {
  buyersphereStore.deleteNote({ buyersphereId, noteId })
} 
</script>

<style lang="postcss" scoped>
</style>