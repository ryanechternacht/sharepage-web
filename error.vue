<template>
  <div class="w-full flex flex-col gap-10 mt-10 items-center px-20">
    <img src="/logo.svg" class="w-40 h-40">
    <h1>
      {{ error?.message ?? "We're sorry. Something went wrong" }}
    </h1>
    <!-- <h1>
      Please reach out to your contact if you think this is a mistake. 
    </h1> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object
})
</script>