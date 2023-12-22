<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/settings/personal`)">Personal</div>
      <h3 class="page-link">Guide Template</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <!-- <h4 class="in-page-link"
          @click="navigateTo('#profile')"></h4>
        <h4 class="in-page-link"
          @click="navigateTo('#login-info')">Login Info</h4> -->
      </div>
      <div class="page-link"
        @click="navigateTo(`/settings/timeline-template`)">Timeline Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/assets-template`)">Assets Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/admin`)">Admin</div>
    </div>
  </div>

  <div class="page-center">
    <div id="success-criteria"
      class="section">
      <div class="group-header">Success Criteria</div>
      
      <h4>How will we know if this product is right for you?</h4>
      <TipTapTextarea 
        modelValue="To be filled out by the buyer"
        readonly
        class="w-full mb-4" />
    </div>

    <div id="objectives"
      class="section">
      <div class="group-header">Objectives</div>
      <h4>These are the core problems we solve</h4>
      <div class="item-list">
        <div v-for="pp in painPoints"
          class="item-list-row">
          <img src="/svg/gift-tag.svg">
          <Tag2 class="whitespace-nowrap" color="blue">{{ pp.title }}</Tag2>
          <div class="inline-html tag" v-html="pp.description" />
          <div class="flex-grow" />
          <BsButton class="show-on-row-hover"
            @click="editObjective({ objective: pp })">
            <img src="/svg/edit.svg" class="min-w-[1rem] h-[1rem]">
          </BsButton>
          <BsButton class="show-on-row-hover">
            <img src="/svg/trash.svg" class="min-w-[1rem] h-[1rem]">
          </BsButton>
        </div>
        <BsButton class="mx-auto"
          @click="addObjective">
          <img src="/svg/new-thing.svg" class="mr-2">
          <div class="tag">Add</div>
        </BsButton>
      </div>

      <h4>Which ones are most important to you? Are there any not covered above?</h4>
      <TipTapTextarea
        modelValue="To be filled out by the buyer"
        readonly
        class="w-full mb-4" />
    </div>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { usePainPointsStore } from '@/stores/pain-points'
import { useFeaturesStore } from '@/stores/features'
import { usePricingStore } from '@/stores/pricing'
import { useUsersStore  } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { format } from 'v-money3'
import lodash_pkg from 'lodash';
const { filter, orderBy } = lodash_pkg;
import AddEditObjectiveModal from '@/components/Settings/AddEditObjectiveModal.vue';
import { useModal } from 'vue-final-modal'

const route = useRoute()
const buyersphereId = parseInt(route.params.id)

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached, getBuyersphereConversationsByIdCached } = storeToRefs(buyersphereStore)

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const usersStore = useUsersStore()
const { isUserSeller } = storeToRefs(usersStore)

const [buyersphere, conversations, painPoints, features, { pricingTiers }, isSeller] = await Promise.all([
  getBuyersphereByIdCached.value(buyersphereId),
  getBuyersphereConversationsByIdCached.value(buyersphereId),
  getPainPointsCached.value(),
  getFeaturesCached.value(),
  getPricingCached.value(),
  isUserSeller.value(),
])

const periodMap = {
  'annually': 'yr',
  'monthly': 'mo',
  'per-seat': 'user'
}

const moneyConfig = {
  precision: 0,
  prefix: '',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const dayjs = useDayjs()
function formatDate(date) {
  return dayjs(date).format('MMM Do')
}

const { 
  open: openObjectiveModal, 
  close: closeObjectiveModal, 
  patchOptions: patchObjectiveModalOptions, 
  options 
} = useModal({
  component: AddEditObjectiveModal,
  attrs: {
    onClose () {
      closeObjectiveModal ()
    }
  }
})

function addObjective () {
  patchObjectiveModalOptions({ attrs: { objective: {} } })
  openObjectiveModal()
}

function editObjective ({ objective }) {
  patchObjectiveModalOptions({ attrs: { objective } })
  openObjectiveModal()
}

</script>

<style lang="postcss" scoped>
.item-list {
  @apply flex flex-col gap-4;

  .item-list-row {
    @apply flex flex-row items-center gap-2;
    min-height: calc(1.5rem + 2px);

    &:hover {
      @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
      width: calc(100% + 2rem);

      > .show-on-row-hover {
        @apply block;
      }
    }

    .show-on-row-hover {
      @apply hidden;
    }
  }
}
</style>
