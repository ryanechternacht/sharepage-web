<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col w-[36rem] gap-2">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit" : "Add" }} Link</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <input v-model="title"
        placeholder="Link Title">
      <input 
        v-model="linkUrl"
        placeholder="Link Url"
        class="mb-2" />
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Link`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Link`"
        :submitted-text="`Link ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
        :disabled="needsMoreInput"
        :submission-state="submissionState"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useSwaypagesStore } from '@/stores/swaypages'

const props = defineProps({
  link: { type: Object, default: {} },
  swaypageId: { type: Number, required: true },
})

const editMode = ref(!!props.link?.id)

const emit = defineEmits(['close'])

const store = useSwaypagesStore();

const title = ref(props.link?.title)
const linkUrl = ref(props.link?.linkUrl)

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.updateLink({
      swaypageId: props.swaypageId, 
      linkId: props.link.id,
      link: {
        title,
        linkUrl,
      }
    })
  } else {
    await store.createLink({ 
      swaypageId: props.swaypageId, 
      title,
      link: {
        title,
        linkUrl,
      }
   })
  }
  emit('close')
})

const needsMoreInput = computed(() => !title.value || !linkUrl.value)
</script>

<style lang="postcss" scoped>
</style>
