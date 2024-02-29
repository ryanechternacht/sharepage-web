<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Asset</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        placeholder="Asset Title">
      <input 
        v-model="link"
        placeholder="Asset Link"
        class="mb-2" />
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
import { useBuyerspheresStore } from '@/stores/buyerspheres'

const props = defineProps({
  asset: { type: Object, default: {} },
  buyersphereId: { type: Number, required: true },
})

const editMode = ref(!!props.asset.id)

const emit = defineEmits(['close'])

const store = useBuyerspheresStore();

const title = ref(props.asset?.title)
const link = ref(props.asset?.link)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updateResource({
      buyersphereId: props.buyersphereId, 
      resourceId: props.asset.id,
      title,
      link,
    })
  } else {
    await store.createResource({ 
      buyersphereId: props.buyersphereId, 
      title,
      link,
   })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value || !link.value)
</script>

<style lang="postcss" scoped>
</style>
