<template>
  <div class="border border-gray-border rounded-md py-.5 px-2 flex flex-row gap-2 items-center bg-white">
    <div class="rounded small-text w-[.875rem] mx-auto text-center"
      :class="{'bg-blue-brand text-white': priority === 1,
               'bg-gray-subtext text-white': priority === 2,
               'bg-gray-border-dark text-subtext': priority === 3}">
               {{ priority }}
    </div>    
    <div class="subtext">{{ priorityTag[priority].text }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  priority: { type: Number, required: true }
})

const priorityTag = {
  1: { 
    text: 'Top'
  },
  2: { 
    text: 'Normal'
  },
  3: { 
    text: 'Low'
  },
}
</script>

<style lang="postcss" scoped>
.small-text {
  font-size: .625rem;
}
</style>
