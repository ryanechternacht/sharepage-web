<template>
  <div class="flex flex-col gap-4 items-start">
    <UInput type="file" size="sm" icon="i-heroicons-folder"
      @change="fileSelected" />
    {{ file }}
    <UButton @click="submitForm">Submit</UButton>
  </div>
</template>

<script setup>
const file = ref(null)

function fileSelected ($e) {
  file.value = $e[0]
}

async function submitForm () {
  const formData = new FormData()

  formData.append('file', file.value)

  const { apiFetch } = useNuxtApp()

  const { data, error } = await apiFetch('/v0.1/csv-upload/template-data/v1', {
    method: 'POST',
    body: formData,
  })
}
</script>
