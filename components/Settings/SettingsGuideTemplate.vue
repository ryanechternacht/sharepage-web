<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/settings/personal`)">Personal</div>
      <h3 class="page-link">Guide Template</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 @click="navigateTo('#success-criteria')"
          class="in-page-link">Success Criteria</h4>
        <h4 @click="navigateTo('#objectives')"
          class="in-page-link">Objectives</h4>
        <h4 @click="navigateTo('#features')"
          class="in-page-link">Features</h4>
        <h4 @click="navigateTo('#pricing')"
          class="in-page-link">Pricing</h4>
        <h4 @click="navigateTo('#constraints')"
          class="in-page-link">Constraints</h4>
        <h4 @click="navigateTo('#milestones')"
          class="in-page-link">Milestones</h4>
      </div>
      <div class="page-link"
        @click="navigateTo(`/settings/timeline-template`)">Timeline Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/assets-template`)">Assets Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/admin`)">Admin</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div id="success-criteria"
      class="section">
      <div class="group-header">Success Criteria</div>
      
      <h4>How will you measure success?</h4>
      <TipTapTextarea is-demo class="w-full mb-4" />
    </div>

    <div id="objectives"
      class="section">
      <div class="group-header">Objectives</div>
      <h4>These are the core problems we solve</h4>
      <div class="item-list">
        <div v-for="objective in painPoints"
          class="item-list-row">
          <TagIcon class="w-[1rem] h-[1rem]"/>
          <Tag class="whitespace-nowrap" color="blue">{{ objective.title }}</Tag>
          <div class="inline-html tag main-content" v-html="objective.description" />
          <DeleteButton class="show-on-row-hover" @click="deleteObjective({ objective })" />
          <EditButton class="show-on-row-hover" @click="editObjective({ objective })" />
        </div>
        <NewButton class="in-section-button"
          @click="addObjective" />
      </div>

      <h4>Which objectives are most important for you? Are any not covered above?</h4>
      <TipTapTextarea is-demo class="w-full mb-4" />
    </div>

    <div id="features"
      class="section">
      <div class="group-header">Features</div>
      <h4>Select which features are most/least important to you</h4>
      <div class="flex flex-col gap-4">
        <div v-for="feature in features"
          class="feature-list">
          <div><!-- empty --></div>
          <h3>{{ feature.title }}</h3>
          <div class="row-span-2 h-full flex flex-row items-center gap-2">
            <!-- buttons are both rows far right column -->
            <DeleteButton class="show-on-row-hover" 
              @click="deleteFeature({ feature })" />
            <EditButton class="show-on-row-hover" 
              @click="editFeature({ feature })" />
          </div>
          <div class="justify-center flex flex-row items-center gap-2">
            <div class="feature-button">
              <CheckCircleIcon />
            </div>
            <div class="feature-button">
              <MinusCircleIcon />
            </div>
            <div class="feature-button">
              <SlashIcon />
            </div>
          </div>
          <div class="gray inline-html" v-html="feature.description" />
        </div>
        <NewButton class="section-add-button"
          @click="addFeature" />
      </div>
    </div>

    <div id="pricing"
      class="section">
      <div class="group-header">Pricing</div>

      <div class="mt-4 flex flex-row items-center">
        <input v-model="showByDefault"
          id="hide-pricing" 
          type="checkbox"
          class="mr-2">
        <label for="hide-pricing">Hide Pricing from Buyers by Default?</label>
      </div>

      <h4>Select the most appropriate tier</h4>
      <div class="pricing-tier-list">
        <div v-for="pricingTier in pricingTiers"
          class="pricing-row">
          <PackageIcon class="w-[1rem] h-[1rem] "/>
          <div>
            <Tag color="gray">
              {{ pricingTier.periodType === 'other'
              ? pricingTier.amountOther
              : `$${format(pricingTier.amountPerPeriod, moneyConfig)}/${periodMap[pricingTier.periodType]}` }}
            </Tag>
          </div>
          <h3 class="leading-[1.375rem]">{{ pricingTier.title }}</h3>
          <div class="row-span-2 h-full flex flex-row items-center gap-2">
            <!-- buttons are both rows far right column -->
            <DeleteButton class="show-on-row-hover" 
              @click="deletePricingTier({ pricingTier })" />
            <EditButton class="show-on-row-hover" 
              @click="editPricingTier({ pricingTier })" />
          </div>
          <div><!-- empty --></div>
          <div class="h-full"><!-- empty --></div>
          <div class="gray inline-html" v-html="pricingTier.description" />
        </div>
      </div>
      <NewButton class="section-add-button"
        @click="addPricingTier" />
    </div>

    <div id="constraints"
      class="section">
      <div class="group-header">Constraints</div>
      <h4>Are there any constraints we should know about?</h4>
      <TipTapTextarea is-demo class="w-full mb-4" />
    </div>

    <div class="vertical-bar" />
  </div>
</template>

<script setup>
import { usePainPointsStore } from '@/stores/pain-points'
import { useFeaturesStore } from '@/stores/features'
import { usePricingStore } from '@/stores/pricing'
import { storeToRefs } from 'pinia'
import { format } from 'v-money3'
import AddEditObjectiveModal from '@/components/Settings/AddEditObjectiveModal.vue';
import AddEditFeatureModal from '@/components/Settings/AddEditFeatureModal.vue';
import AddEditPricingTierModal from '@/components/Settings/AddEditPricingTierModal.vue';
import { useModal } from 'vue-final-modal'
import lodash_pkg from 'lodash';
const { debounce } = lodash_pkg;

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const featuresStore = useFeaturesStore()
const { getFeaturesCached } = storeToRefs(featuresStore)

const pricingStore = usePricingStore()
const { getPricingCached } = storeToRefs(pricingStore)

const [painPoints, features, { pricingTiers, settings }] = await Promise.all([
  getPainPointsCached.value(),
  getFeaturesCached.value(),
  getPricingCached.value(),
])

const showByDefault = ref(settings.showByDefault)

const debouncedSavePricingVisibilityDefault = 
  debounce(async () => await pricingStore.updateSettings({ showByDefault }), 2000)

watch(() => showByDefault.value, (newValue) => debouncedSavePricingVisibilityDefault())

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

const { 
  open: openObjectiveModal,
  close: closeObjectiveModal,
  patchOptions: patchObjectiveModalOptions,
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

async function deleteObjective({ objective }) {
  const c = confirm(`Are you sure you want to delete "${objective.title}"`)

  if (c) {
    await painPointsStore.deletePainPoint({ painPoint: objective})
  }
}

const { 
  open: openFeatureModal,
  close: closeFeatureModal,
  patchOptions: patchFeatureModalOptions,
} = useModal({
  component: AddEditFeatureModal,
  attrs: {
    onClose () {
      closeFeatureModal ()
    }
  }
})

function addFeature () {
  patchFeatureModalOptions({ attrs: { feature: {} } })
  openFeatureModal()
}

function editFeature ({ feature }) {
  patchFeatureModalOptions({ attrs: { feature } })
  openFeatureModal()
}

async function deleteFeature({ feature }) {
  const c = confirm("Are you sure you want to delete")

  if (c) {
    await featuresStore.deleteFeature({ feature })
  }
}

const { 
  open: openPricingTierModal,
  close: closePricingTierModal,
  patchOptions: patchPricingTierModalOptions,
} = useModal({
  component: AddEditPricingTierModal,
  attrs: {
    onClose () {
      closePricingTierModal ()
    }
  }
})

function addPricingTier () {
  patchPricingTierModalOptions({ attrs: { pricingTier: {} } })
  openPricingTierModal()
}

function editPricingTier ({ pricingTier }) {
  patchPricingTierModalOptions({ attrs: { pricingTier } })
  openPricingTierModal()
}

async function deletePricingTier({ pricingTier }) {
  const c = confirm("Are you sure you want to delete")

  if (c) {
    await pricingStore.deletePricingTier({ pricingTier })
  }
}
</script>

<style lang="postcss" scoped>
.item-list {
  @apply flex flex-col gap-4;

  .item-list-row {
    @apply flex flex-row items-center gap-2;
    min-height: calc(1.5rem + 2px);

    * {
      @apply shrink-0;
    }

    .main-content {
      @apply shrink grow;
    }

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

    /* ensures 2rem height even when no buttons are showing */
    &::after {
      @apply h-[2rem] ml-[-.5rem];
      content: '';
    }
  }

  .in-section-button {
    /* adapted from .section-add-button in tailwind.css */
    @apply my-2 bg-white hover:bg-blue-primary;

    /* midway - left sidebar - btn width - center left margin*/
    margin-left: calc(50vw - 220px - 3.5rem - .75rem);

    /* midway - btn width - center right margin*/
    margin-right: calc(50vw - 3.5rem - 3rem);
  }
}

.feature-button {
  @apply p-2 rounded-md border border-gray-border;
}

.feature-list {
  @apply bg-white grid items-center gap-x-4 gap-y-1;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;

  &:hover {
    @apply bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
      width: calc(100% + 2rem);
  
    .show-on-row-hover {
      @apply block;
    }
  }

  .show-on-row-hover {
    @apply hidden;
  }
}

.pricing-tier-list {
  @apply grid items-center;
  grid-template-columns: auto auto 1fr 5rem;

  /* extra vertical gap between sections */
  > div > *:nth-child(6n + 1),
  > div > *:nth-child(6n + 2),
  > div > *:nth-child(6n + 3) {
    @apply pt-[.375rem];
  }
  > div > *:nth-child(6n + 4),
  > div > *:nth-child(6n + 5),
  > div > *:nth-child(6n + 6) {
    @apply pb-[.375rem];
  }

  .pricing-row {
    @apply contents;

    > * {
      /* simluate gap-x-3 and gap-y-1 on the grid */
      @apply px-[.375rem] py-[.125rem]
    }

    &:hover .show-on-row-hover {
      @apply block;
    }
  }

  .show-on-row-hover {
    @apply hidden;
  }
}
</style>
