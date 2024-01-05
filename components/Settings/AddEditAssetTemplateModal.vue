<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem]">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Asset</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        class="mb-2"
        placeholder="Asset Title">
      <input v-model="link"
        placeholder="Asset Link"
        class="w-full mb-4" />
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Asset`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Asset`"
        :submitted-text="`Asset ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useResourcesStore } from '@/stores/resources'

const props = defineProps({
  asset: { type: Object, default: {} },
  buyersphereId: { type: Number, required: true },
})

const editMode = ref(!!props.asset.id)

const emit = defineEmits(['close'])

const store = useResourcesStore();

const title = ref(props.asset?.title)
const link = ref(props.asset?.link)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updateResource({ resource: {
      ...props.asset,
      title: title.value,
      link: link.value
    } })
  } else {
    await store.createResource({ resource: {
      title: title.value,
      link: link.value
    } })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value || !link.value)
</script>

<style lang="postcss" scoped>
</style>
