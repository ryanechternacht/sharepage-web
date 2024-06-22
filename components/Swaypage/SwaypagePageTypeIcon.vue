<template>
  <!-- <UIcon :name="icon" /> -->
  <UIcon :name="getSwaypageTypeIcon(pageType)" />
</template>

<script setup>
const props = defineProps({
  pageType: { type: String, required: true }
})

const { getSwaypageTypeIcon } = useSwayageIcons()
</script>
