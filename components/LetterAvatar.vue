<template>
  <div class="bg-green-darker rounded-full h-6 w-6 flex flex-row items-center"> 
    <h3 class="dark mx-auto">{{ letter }}</h3>
  </div>
</template>

<script setup>
const props = defineProps({ letter: String })
</script>