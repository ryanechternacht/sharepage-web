<template>
  <div class="container">
    <template v-for="s in stages">
      <div
        v-if="currentStage === s.name"
        class="flex-grow flex flex-row items-center bg-gray-lighter rounded-md w-[6rem] h-full justify-between px-2 relative z-[1]">
        <div class="flex-grow flex flex-col gap-y-1">
          <h3 clas=flex-grow>Current Stage: {{ s.name }}</h3>
          <div class="gray">Asking the question, does this solution make sense for us?</div>
        </div>
        <div class="py-0.5 flex flex-col gap-y-[2px]">
          <Tag
            width="5.5rem" 
            height="1.125rem" 
            color="green">Next Stage</Tag>
          <Tag
            width="5.5rem" 
            height="1.125rem" 
            color="orange">Put on Hold</Tag>
          <Tag
            width="5.5rem" 
            height="1.125rem" 
            color="red">Opt Out</Tag>
        </div>
      </div>
      <div 
        v-else
        class="flex flex-col items-center bg-gray-lighter rounded-md w-[6rem] h-full justify-between py-1 z-[1]">
        <div class="tag gray">Target: {{ s.date }}</div>
        <h3 class="gray">{{ s.name }}</h3>
        <div class="tag gray italic">In XXX days</div>
      </div>
    </template>
    <div class="w-full border border-gray-dark absolute" />
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
