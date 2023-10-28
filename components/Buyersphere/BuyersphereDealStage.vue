<template>
  <div class="container">
    <template v-for="s in stages">
      <div
        v-if="capitalize(buyersphere.currentStage) === s.name"
        class="flex-grow flex flex-row items-center bg-purple-background rounded-md w-[6.5rem] h-full justify-between px-2 relative z-[1]">
        <div class="flex-grow flex flex-col gap-y-1">
          <h3 clas=flex-grow>Current Stage: {{ s.name }}</h3>
          <div class="gray">{{ s.description }}</div>
        </div>
        <div v-if="buyersphere.currentStage !== 'adoption'" 
          class="py-0.5 flex flex-col gap-y-1 min-w-[5.25rem]">
          <template v-if="buyersphere.status === 'active'">
            <MiniButton 
              color="teal"
              text="Next Stage"
              @click="advanceStage" />
            <MiniButton 
              color="orange"
              text="Put on Hold" 
              @click="putOnHold"/>
            <MiniButton 
              color="red"
              text="Opt Out" 
              @click="optOut"/>
          </template>
          <template v-else>
            <Tag
              v-if="buyersphere.status === 'on-hold'"
              height="1.125rem"
              color="orange">ON HOLD</Tag>
            <Tag
              v-else-if="buyersphere.status === 'opt-out'"
              height="1.125rem"
              color="red">OPT OUT</Tag>
            <MiniButton 
              color="teal"
              text="Activate?" 
              @click="activate"/>
          </template>
        </div>
      </div>
      <div v-else
        class="flex flex-col items-center rounded-md w-[6.5rem] h-full justify-between py-1 z-[1]"
        :class="{'bg-gray-lighter': currentStageNumber < s.stageNumber,
                 'bg-green-background': currentStageNumber > s.stageNumber}">
        
        <div v-if="currentStageNumber < s.stageNumber" 
          class="tag gray">Target: {{ s.date }}</div>
        <div v-else>On {{ s.happenedOn }}</div>
        <h3 class="gray">{{ s.name }}</h3>
        <div v-if="currentStageNumber < s.stageNumber" 
          class="tag gray italic">In {{ s.daysTo }} days</div>
        <div v-else>&nbsp;</div>
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
const emit = defineEmits(['update:status', 'update:stage'])

const stageMapping = {
  'qualification': 0,
  'evaluation': 1,
  'decision': 2,
  'adoption': 3
}

const currentStageNumber = computed(() => stageMapping[buyersphere.currentStage])

function buildStage (stage, stageNumber, description, targetDate, happenedOn) {
  const targetDayjs =  dayjs(new Date(targetDate))

  return {
    name: stage,
    description,
    stageNumber,
    date: targetDayjs.format('MMM Do'), 
    daysTo: targetDayjs.diff(dayjs(), 'days') + 1,
    happenedOn: dayjs(new Date(happenedOn)).format('MMM D')
  }
}

const stages = computed(() => [
  buildStage(
    'Qualification',
    0,
    'Asking the question, does this solution make sense for us?',
    null,
    buyersphere.qualifiedOn),
  buildStage(
    'Evaluation',
    1,
    'Examining in detail if this is the right solution',
    buyersphere.qualificationDate,
    buyersphere.evaluatedOn),
  buildStage(
    'Decision',
    2,
    'Making the decision if this is the right choice',
    buyersphere.evaluationDate,
    buyersphere.decidedOn),
  buildStage(
    'Adoption',
    3,
    'Congrats! Now let\'s make this a success!',
    buyersphere.decisionDate,
    buyersphere.adoptedOn),
])

function advanceStage() {
  const nextStage = {
    'qualification': 'evaluation',
    'evaluation': 'decision',
    'decision': 'adoption'
  }[buyersphere.currentStage]

  const answer = confirm(`Are you sure you'd like to proceed to the ${capitalize(nextStage)} stage?`)

  if (answer) {
    emit('update:stage', { stage: nextStage })
  }
}

function putOnHold() {
  const answer = confirm(`Are you sure you'd like to put this buying process on hold?`)

  if (answer) {
    emit('update:status', { status: "on-hold"})
  }
}

function optOut() {
  const answer = confirm(`Are you sure you want to stop this buying process?`)
  
  if (answer) {
    emit('update:status', { status: "opt-out" })
  }
}

function activate() {
  const answer = confirm(`Are you sure you want to reactive the buying process?`)
  
  if (answer) {
    emit('update:status', { status: "active" })
  }
}
</script>

<style lang="postcss" scoped>
.container {
  @apply flex flex-row items-center h-full justify-between py-2 gap-x-4;
  position: relative;
}
</style>
