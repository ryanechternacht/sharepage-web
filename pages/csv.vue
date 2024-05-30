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
  console.log($e)
  file.value = $e[0]
  console.log(file.value)
}

async function submitForm () {
  console.log('submit')

  const formData = new FormData()

  formData.append('file', file.value)

  const { apiFetch } = useNuxtApp()

  const { data, error } = await apiFetch('/v0.1/csv', {
    method: 'POST',
    body: formData,
  })
}
</script>
