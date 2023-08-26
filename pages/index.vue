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

    <div class="flex flex-col items-center text-center w-[720px] mx-auto">
      <h1 class="mt-20 leading-[56px]">
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
          <option :value="null">Any</option>
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
        <NuxtLink 
          v-for="b in buyerspheres" 
          class="grid-row"
          :to="{ path: `/buyersphere/${b.id}` }">
          <div class="grid-cell">
            <Logo :src="b.buyerLogo" size="large" />
          </div>
          <div class="grid-cell left-align">
            <h3>{{ b.buyer }}</h3>
          </div>
          <div class="grid-cell">
            <Tag :color="stageColor(b.currentStage)">{{ capitalize(b.currentStage) }}</Tag>
          </div>
          <div class="grid-cell">
            <Tag :color="pricingColor(b.pricingAnswer)">{{ coalescePricingAnswer(b.pricingAnswer) }}</Tag>
          </div>
          <div class="grid-cell">
            <Tag v-if="isOverdue(b)" color="red">Overdue</Tag>
          </div>
        </NuxtLink>
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
    : "$--"
}

function pricingColor ({ selectedLevel }) {
  return selectedLevel && Object.keys(selectedLevel).length > 0
    ? "yellow"
    : "gray"
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
  @apply inline mx-1 h1 p-[2px];
}

.buyersphere-table {
  @apply grid;
  grid-template-columns: repeat(5, max-content);

  .grid-cell {
    @apply p-2 h-full flex flex-row items-center;

    * {
      @apply flex-grow;
    }

    &.left-align * {
      flex-grow: 0;
    }
  }

  .grid-row {
    @apply contents;
    &:hover {
      @apply cursor-pointer;
      .grid-cell {
        @apply bg-gray-lighter;
      }
    }
  }
}
</style>