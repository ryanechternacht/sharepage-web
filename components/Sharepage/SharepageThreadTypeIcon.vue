<template>
  <!-- <UIcon :name="icon" /> -->
  <UIcon :name="getSharepageThreadTypeIcon(pageType)" />
</template>

<script setup>
const props = defineProps({
  pageType: { type: String, required: true }
})

const { getSharepageThreadTypeIcon } = useSharepageIcons()
</script>
