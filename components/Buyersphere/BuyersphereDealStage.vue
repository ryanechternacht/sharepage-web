<template>
  <div class="container">
    <template v-for="s in stages">
      <div 
        v-if="currentStage === s.name"
        class="flex-grow flex flex-row items-center bg-gray-light rounded-md w-[6rem] h-full justify-between px-2"
        >
        <div class="flex-grow flex flex-col gap-y-1">
          <h3 clas=flex-grow>Current Stage: {{ s.name }}</h3>
          <div class="gray">Asking the question, does this solution make sense for us?</div>
        </div>
        <div class="py-0.5 flex flex-col">
          <Tag 
            width="5.5rem" 
            height="1.125rem" 
            bg="bg-green-lightest">Next Stage</Tag>
          <Tag 
            width="5.5rem" 
            height="1.125rem" 
            bg="bg-yellow-lightest">Put on Hold</Tag>
          <Tag 
            width="5.5rem" 
            height="1.125rem" 
            bg="bg-red-light">Opt Out</Tag>
        </div>
      </div>
      <div 
        v-else
        class="flex flex-col items-center bg-gray-light rounded-md w-[6rem] h-full justify-between py-1"
      >
        <div class="tag gray">Target: {{ s.date }}</div>
        <h3 class="gray">{{ s.name }}</h3>
        <div class="tag gray italic">In XXX days</div>
      </div>
    </template>
  </div>
</template>

<script setup>
const stages = ref([
  {name: 'Qualification', date: '' },
  {name: 'Evaluation', date: '06/28/2023'},
  {name: 'Decision', date: '06/28/2023'},
  {name: 'Adoption', date: '06/28/2023'},
])

const currentStage = ref('Qualification')
</script>

<style lang="postcss" scoped>
.container {
  @apply flex flex-row items-center h-full justify-between py-2 gap-x-4;
  position: relative;
}
.label {
  @apply w-[5.5rem] h-[1.125rem] rounded-full tag gray
    flex flex-row items-center justify-items-center;
}
</style>
