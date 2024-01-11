<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ team }} Team</h3>
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
        :disabled="editMode"
        class="mb-2"
        placeholder="Email">
      <input v-model="displayRole" 
        class="mb-4"
        placeholder="Role">
      <SubmitButton 
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} User`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} User`"
        :submitted-text="`User ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const props = defineProps({
  team: { type: String, required: true },
  buyersphereId: { type: Number, required: true },
  user: { type: Object },
})

const editMode = ref(!!props.user?.id)

const emit = defineEmits(['close'])

const store = useBuyerspheresStore()

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.editBuyerUser({ 
      buyersphereId: props.buyersphereId,
      user: { 
        id: props.user.id,
        firstName,
        lastName,
        email,
        displayRole
      }
    })
  } else {
    await store.createBuyerUser({ 
      buyersphereId: props.buyersphereId,
      user: { firstName, lastName, email, displayRole }
    })
  }
  emit('close')
})

const firstName = ref(props.user?.firstName)
const lastName = ref(props.user?.lastName)
const email = ref(props.user?.email)
const displayRole = ref(props.user?.displayRole)

const needsMoreInput = computed(() => 
  !firstName.value || !lastName.value || !email.value || !displayRole.value)
</script>

<style lang="postcss" scoped>
</style>
