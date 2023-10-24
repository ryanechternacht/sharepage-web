<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ buyer }} Team</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div class="flex flex-row mb-2 gap-x-2">
        <input v-model="firstName" 
          ref="firstNameElem"
          class="flex-grow"
          placeholder="First Name">
        <input v-model="lastName" 
          ref="lastNameElem"
          class="flex-grow"
          placeholder="Last Name">
      </div>
      <input v-model="email" 
        ref="emailElem"
        class="mb-2"
        placeholder="Email">
      <input v-model="displayRole" 
        ref="displayRoleElem"
        class="mb-4"
        placeholder="Role">
      <SubmitButton 
        class="self-center"
        ready-text="👋 Invite"
        submitting-text="Creating"
        error-text="Invite Failed"
        :submission-state="submissionState"
        @click="invite" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const props = defineProps({
  buyer: { type: String, required: true },
  buyersphereId: { type: Number, required: true }
})

const emit = defineEmits(['close'])

const store = useBuyerspheresStore()

const { submissionState, submitFn } = useSubmit(async () => {
  const user = {firstName, lastName, email, displayRole}
  await store.createBuyerUser({ buyersphereId: props.buyersphereId, user})
})

const firstName = ref('')
const firstNameElem = ref(null)
const lastName = ref('')
const lastNameElem = ref(null)
const email = ref('')
const emailElem = ref(null)
const displayRole = ref('')
const displayRoleElem = ref(null)

// TODO enter doesn't work here
function invite () {
  if (!firstName.value) {
    firstNameElem.value.focus()
  } else if (!lastName.value) {
    lastNameElem.value.focus()
  } else if (!email.value) {
    emailElem.value.focus()
  } else if (!displayRole.value) {
    displayRoleElem.value.focus()
  } else {
    submitFn()
  }
}

watch(submissionState, (newState, _) => {
  if (newState === 'submitted') {
    emit('close')
  }
})
</script>

<style lang="postcss" scoped>
</style>
