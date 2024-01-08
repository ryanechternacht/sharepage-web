<template>
  <div>
    <TopNav />

    <div class="flex flex-col items-center text-center w-[720px] mx-auto">
      <h1 class="mt-20 leading-[56px]">
        Show me 
        <select v-model="owner" class="big-select bg-green-background">
          <option :value="null">Anyone's</option>
          <option :value="user.id">My</option>
          <option v-for="u in usersExceptMe" :value="u.id">
            {{ u.firstName }} {{ u.lastName }}'s
          </option>
        </select>
        <select v-model="status" class="big-select bg-blue-background">
          <option value="active">Active</option>
          <option value="not-active">Not Active</option>
          <option class="on-hold">On Hold</option>
          <option class="opt-out">Opt Out</option>
        </select>
        Opportunities in
        <select v-model="stage" class="big-select bg-purple-background">
          <option :value="null">Any</option>
          <option value="qualification">Qualification</option>
          <option value="evaluation">Evaluation</option>
          <option value="decision">Decision</option>
        </select>
        Stage
      </h1>

      <div class="buyersphere-table mt-10">
        <div class="header-row">
          <h3>Buyerspheres</h3>
          <BsButton class=""
            @click="openBuyersphereModal">
            + Add
          </BsButton>
        </div>
        <NuxtLink 
          v-for="b in buyerspheres"
          :key="b.id"
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
            <Tag :color="pricingColor(b.pricingTierId)">{{ coalescePricingAnswer(b.pricingTierId) }}</Tag>
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
import { usePricingStore } from '@/stores/pricing'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { capitalize, filter, find, sortBy } = lodash_pkg;
import { useModal } from 'vue-final-modal'
import AddEditBuyersphereModal from '@/components/AddEditBuyersphereModal'

const usersStore = useUsersStore()
const { getMeCached, getUsersCached } = storeToRefs(usersStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const [user, users, { pricingTiers }] = await Promise.all([
  getMeCached.value(),
  getUsersCached.value(),
  getPricingCached.value()
])

const usersExceptMe = ref(
  sortBy(
    filter(users, u => u.id !== user.id),
    ['firstName']  
  )
)

const owner = ref(null)
const status = ref('active')
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
    'qualification': 'blue',
    'evaluation': 'green',
    'decision': 'red'
  }[stage]
}

function coalescePricingAnswer (pricingTierId) {
  const tier = find(pricingTiers, pt => pt.id === pricingTierId)

  return tier ? tier.title : "$--"
}

function pricingColor (pricingTierId) {
  const tier = find(pricingTiers, pt => pt.id === pricingTierId)

  return tier ? "orange" : "gray"
}

const dayjs = useDayjs()
function isOverdue ({ currentStage, qualificationDate, evaluationDate, decisionDate }) {
  if (currentStage === 'qualification' && dayjs().isAfter(dayjs(qualificationDate))) {
    return true
  } else if (currentStage === 'evaluation', dayjs().isAfter(dayjs(evaluationDate))) {
    return true
  } else if (currentStage === 'decision', dayjs().isAfter(dayjs(decisionDate))) {
    return true
  } else {
    return false
  }
} 

const { open: openBuyersphereModal, close: closeBuyersphereModal } = useModal({
  component: AddEditBuyersphereModal,
  attrs: {
    onClose () {
      closeBuyersphereModal()
      refresh()
    }
  }
})
</script>

<style lang="postcss" scoped>
.big-select {
  @apply inline mx-1 h1 p-[2px];
}

.buyersphere-table {
  @apply grid;
  grid-template-columns: repeat(5, max-content);

  .header-row {
    @apply col-span-5 flex flex-row gap-x-4 items-center;
  }

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
        @apply bg-gray-hover;
      }
    }
  }
}
</style>