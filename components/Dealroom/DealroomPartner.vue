<template>
  <div>
    partner {{ partner }}
  </div>
</template>

<script setup>
const props = defineProps({ partner: String })
</script>