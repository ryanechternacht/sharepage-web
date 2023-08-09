<template>
  <div class="flex flex-col items-center">
    <Logo :src="organization.logo" size="x-large" />
    <h1 class="leading-[3.75rem]">Invite Users</h1>
    <div class="grid grid-cols-2 grid-rows-2 gap-1">
      <input
        v-model="firstName"
        ref="firstNameElem"
        placeholder="First Name"
        @keyup.enter="checkReady('firstName')">
      <input
        v-model="lastName"
        ref="lastNameElem"
        placeholder="Last Name"
        @keyup.enter="checkReady('lastName')">
      <input
        v-model="roleTitle"
        ref="roleTitleElem"
        placeholder="Role Title"
        @keyup.enter="checkReady('roleTitle')">
      <input
        v-model="email"
        ref="emailElem"
        placeholder="Email"
        @keyup.enter="checkReady('email')">
    </div>
    <SubmitButton
      class="mt-2 w-[10rem] h-[2.5rem]"
      :submission-state="submissionState" 
      ready-text="Add Persona"
      submitting-text="Saving Persona"
      submitted-text="Persona Saved"
      @click="checkReady('button')"/>

    <div class="mt-10 w-full max-w-[400px]">
      <h3 class="text-center">Current Users:</h3>
      <PersonList :people="users" />
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/stores/organization'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const usersStore = useUsersStore()
const { getUsersCached } = storeToRefs(usersStore)

const [organization, users] = await Promise.all([
  getOrganizationCached.value(),
  getUsersCached.value()
])

const firstName = ref('')
const lastName = ref('')
const roleTitle = ref('')
const email = ref('')
const firstNameElem = ref(null)
const lastNameElem = ref(null)
const roleTitleElem = ref(null)
const emailElem = ref(null)

const { submissionState, submitFn } = useSubmit(async () => 
  await usersStore.createUser({ user: {
    first_name: firstName.value,
    last_name: lastName.value,
    display_role: roleTitle.value,
    email: email.value
  }}))

async function checkReady() {
  if (firstName.value && lastName.value && roleTitle.value && email.value) {
    submitFn()
    firstName.value = ''
    lastName.value = ''
    roleTitle.value = ''
    email.value = ''
    firstNameElem.value.focus()
  } else if (!firstName.value) {
    firstNameElem.value.focus()
  } else if (!lastName.value) {
    lastNameElem.value.focus()
  } else if (!roleTitle.value) {
    roleTitleElem.value.focus()
  } else if (!email.value) {
    emailElem.value.focus()
  }
}
</script>

<style lang="postcss" scoped>
</style>
