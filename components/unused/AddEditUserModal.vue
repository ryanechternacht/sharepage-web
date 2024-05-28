<template>
  <div>
    placeholder till later
  </div>
  <!-- <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md">
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-3">
        <h2 class="flex-grow">Add New User</h2>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div class="flex flex-row mb-2 gap-x-2">
        <input v-model="firstName" 
          class="flex-grow"
          placeholder="First Name">
        <input v-model="lastName" 
          class="flex-grow"
          placeholder="Last Name">
      </div>
      <input v-model="email" 
        class="mb-2"
        :disabled="user"
        placeholder="Email">
      <input v-model="displayRole" 
        class="mb-4"
        placeholder="Role">
      <SubmitButton 
        class="self-center"
        :ready-text="readyText"
        :submitting-text="submittingText"
        :error-text="errorText"
        :submission-state="submissionState"
        :disabled="needsMoreInput"
        @click="submitFn" />
    </div>
  </VueFinalModal> -->
</template>

<script setup>
// import { VueFinalModal } from 'vue-final-modal'
// import { useUsersStore } from '@/stores/users'

// const { user } = defineProps({
//   user: { type: Object, default: {}}
// })

// const emit = defineEmits(['close'])

// const usersStore = useUsersStore()

// const readyText = computed(() => user ? "Update User" : "Create User")
// const submittingText = computed(() => user ? "Updating" : "Creating")
// const errorText = computed(() => user ? "Update Failed" : "Creation Failed")

// const { submissionState, submitFn } = useSubmit(async () => {
//   if (user) {
//     await usersStore.updateUser({
//       id: user.id,
//       firstName: firstName.value,
//       lastName: lastName.value,
//       displayRole: displayRole.value,
//     })
//   } else {
//     await usersStore.createUser({ user: {
//       firstName: firstName.value,
//       lastName: lastName.value,
//       displayRole: displayRole.value,
//       email: email.value,
//     }})
//   }
//   emit('close')
// })

// const firstName = ref(user ? user.firstName : '')
// const lastName = ref(user ? user.lastName : '')
// const email = ref(user ? user.email : '')
// const displayRole = ref(user ? user.displayRole : '')

// const needsMoreInput = computed(() => {
//   return !firstName.value || !lastName.value || !email.value || !displayRole.value
// })
</script>

<style lang="postcss" scoped>
</style>
