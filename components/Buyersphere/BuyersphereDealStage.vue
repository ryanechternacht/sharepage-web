<template>
  <div class="container">
    <template v-for="s in stages">
      <div
        v-if="capitalize(buyersphere.currentStage) === s.name"
        class="flex-grow flex flex-row items-center bg-gray-lighter rounded-md w-[6rem] h-full justify-between px-2 relative z-[1]">
        <div class="flex-grow flex flex-col gap-y-1">
          <h3 clas=flex-grow>Current Stage: {{ s.name }}</h3>
          <div class="gray">Asking the question, does this solution make sense for us?</div>
        </div>
        <div class="py-0.5 flex flex-col gap-y-[2px]">
          <Tag
            class="hover:cursor-pointer"
            width="5.5rem"
            height="1.125rem"
            color="green"
            @click="advanceStage">Next Stage</Tag>
          <Tag
            class="hover:cursor-pointer"
            width="5.5rem"
            height="1.125rem"
            color="orange"
            @click="putOnHold">Put on Hold</Tag>
          <Tag
            class="hover:cursor-pointer"
            width="5.5rem"
            height="1.125rem"
            color="red"
            @click="optOut">Opt Out</Tag>
        </div>
      </div>
      <div 
        v-else
        class="flex flex-col items-center bg-gray-lighter rounded-md w-[6rem] h-full justify-between py-1 z-[1]">
        <div class="tag gray">Target: {{ s.date }}</div>
        <h3 class="gray">{{ s.name }}</h3>
        <div class="tag gray italic">In {{ s.daysTo }} days</div>
      </div>
    </template>
    <div class="w-full border border-gray-dark absolute" />
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { capitalize } = lodash_pkg;
const dayjs = useDayjs()

const { buyersphere } = defineProps({ buyersphere: Object })

function buildStage (stage, targetDate, happenedOn) {
  const targetDayjs =  dayjs(new Date(targetDate))

  return {
    name: stage, 
    date: targetDayjs.format('MMM D'), 
    daysTo: targetDayjs.diff(dayjs(), 'days') + 1,
    happenedOn: dayjs(new Date(happenedOn))
  }
}

const stages = ref([
  buildStage('Qualification', buyersphere.qualificationDate, buyersphere.qualifiedOn),
  buildStage('Evaluation', buyersphere.evaluationDate, buyersphere.evaluatedOn),
  buildStage('Decision', buyersphere.decisionDate, buyersphere.decidedOn),
  buildStage('Adopted', buyersphere.adoptionDate, buyersphere.adoptedOn),
])

function advanceStage() {
  const nextStage = {
    'qualification': 'Evaluation',
    'evaluation': 'Decision',
    'decision': 'Adoption'
  }[buyersphere.currentStage]

  const answer = confirm(`Are you sure you'd like to proceed to the ${nextStage} stage?`)

  // TODO advance stage
}

function putOnHold() {
  const answer = confirm(`Are you sure you'd like to opt out of this buying process?`)

  // TODO put on hold
}

function optOut() {
  const answer = confirm(`Are you sure you want to stop this buying process?`)
  
  // TODO opt out
}
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
