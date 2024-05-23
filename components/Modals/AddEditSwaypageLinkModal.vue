<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          {{ editMode ? "Edit" : "Add" }} Link
        </h2>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Link Title *</div>
          <UInput
            v-model="title"
            placeholder="Link Title" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Link Url *</div>
          <UInput
            v-model="linkUrl"
            placeholder="Link Url"
            class="w-full" />
        </div>
        <SubmitButtonNew 
          :icon="editMode ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'"
          :ready-text="`${editMode ? 'Edit' : 'Add'} Link`"
          :submitting-text="`${editMode ? 'Editing' : 'Adding'} Link`"
          :submitted-text="`Link ${editMode ? 'Edited' : 'Added'}`"
          :error-text="`${editMode ? 'Editing' : 'Adding'} Failed`"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" />
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'

const store = useSwaypagesStore()

const props = defineProps({
  link: { type: Object, default: {} },
  swaypageId: { type: Number, required: true },
})

const editMode = ref(!!props.link?.id)

const emit = defineEmits(['close'])

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
