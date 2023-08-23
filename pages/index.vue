<template>
  <div>
    <div class="sticky">
      <div class="flex flex-row items-center p-8 h-12 justify-between">
        <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
          <img src="/logo.svg">
          <h3>Buyersphere</h3>
        </NuxtLink>
        <div class="flex flex-row items-center gap-x-2">
          <span>{{ user.name || user.email }}</span>
          👤
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center">
      <h1 class="mt-20">
        Show me 
        <select v-model="owner" class="big-select bg-green-muted">
          <option :value="null">Anyone's</option>
          <option :value="user.id">My</option>
          <option v-for="u in usersExceptMe" :value="u.id">
            {{ u.firstName }} {{ u.lastName }}'s
          </option>
        </select>
        <select v-model="status" class="big-select bg-blue-muted">
          <option>Active</option>
          <option>Not Active</option>
          <option>On Hold</option>
          <option>Opt Out</option>
        </select>
        Opportunities in
        <select v-model="stage" class="big-select bg-purple-muted">
          <option :value="null">All Opportunities</option>
          <option value="qualification">Qualification</option>
          <option value="evaluation">Evaluation</option>
          <option value="decision">Decision</option>
        </select>
        Stage
      </h1>

      <button class="bg-green-darker w-[10rem] h-[2.5rem] mt-8 text-white rounded">
        Add
      </button>

      <div class="buyersphere-table mt-10">
        <template v-for="b in buyerspheres">
          <Logo :src="b.buyerLogo" size="large" />
          <h3>{{ b.buyer }}</h3>
          <Tag :color="stageColor(b.currentStage)">{{ capitalize(b.currentStage) }}</Tag>
          <Tag color="yellow">{{ coalescePricingAnswer(b.pricingAnswer) }}</Tag>
          <div><Tag v-if="isOverdue(b)" color="red">Overdue</Tag></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { filter, sortBy, capitalize } = lodash_pkg;

const usersStore = useUsersStore()
const { getMeCached, getUsersCached } = storeToRefs(usersStore)

const [user, users] = await Promise.all([
  getMeCached.value(),
  getUsersCached.value()
])

const usersExceptMe = ref(
  sortBy(
    filter(users, u => u.id !== user.id),
    ['firstName']  
  )
)

const owner = ref(null)
const status = ref('Active')
const stage = ref(null)

// TODO this shouldn't be necessary, but query doesn't seem to be
// reactive automatically
const query = computed(() => ({
  ['user-id']: owner.value,
  status: status.value,
  stage: stage.value
}))

const { apiFetch } = useNuxtApp()
const { data: buyerspheres, refresh } = await apiFetch('/v0.1/buyerspheres', { 
  query
})

watch(owner, () => refresh, { flush: 'post' })
watch(status, () => refresh, { flush: 'post' })
watch(stage, () => refresh, { flush: 'post' })

function stageColor (stage) {
  return {
    'closed': 'gray',
    'qualification': 'blue',
    'evaluation': 'green',
    'decision': 'red'
  }[stage]
}

function coalescePricingAnswer ({ selectedLevel }) {
  return selectedLevel && Object.keys(selectedLevel).length > 0
    ? selectedLevel
    : "None Selected"
}

const dayjs = useDayjs()
function isOverdue ({ currentStage, qualificationDate, evaluationDate, decisionDate }) {
  if (currentStage === 'qualification' && dayjs().isBefore(dayjs(qualificationDate))) {
    return true
  } else if (currentStage === 'evaluation', dayjs().isBefore(dayjs(evaluationDate))) {
    return true
  } else if (currentStage === 'decision', dayjs().isBefore(dayjs(decisionDate))) {
    return true
  } else {
    return false
  }
} 
</script>

<style lang="postcss" scoped>
.big-select {
  @apply inline mx-1 h1;
}

.buyersphere-table {
  @apply grid gap-x-4 gap-y-4 items-center;
  grid-template-columns: repeat(5, max-content);
}
</style>