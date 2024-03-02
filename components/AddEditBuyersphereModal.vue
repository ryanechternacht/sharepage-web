<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col gap-2 w-[36rem]"
      @click="showClearbit = false">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">{{ editMode ? "Edit this" : "Create a new" }} Account</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div>
        <h3>Account Name (required)</h3>
        <input v-model="buyer"
          class="flex-grow mb-2"
          placeholder="Buyer Name">
      </div>
      <div>
        <h3>Group Name within Account</h3>
        <input v-model="subname"
          class="flex-grow mb-2"
          placeholder="Group Name">
      </div>
      <div class="mb-4">
        <h3>Account Logo (required)</h3>
        <input v-model="buyerLogo" 
          class="flex-grow"
          placeholder="Enter url or start typing to search"
          @input="debouncedLookupOnClearbit"
          @click.stop="showClearbit = true">
        <div v-if="showClearbit && clearbitOptions.length" 
          class="absolute mt-1">
          <div class="clearbit-options">
            <div v-for="o in clearbitOptions"
              class="clearbit-option"
              @click="selectClearbitOption(o.logo)">
              <img :src="o.logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
              <div class="grow">{{ o.name }}</div>
              <div class="shrink-0 tag">{{ o.domain }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!editMode">
        <h3>Starting Page (required)</h3>
        <input v-model="pageTitle"
          class="w-full mb-2"
          placeholder="Starting Page Title">
        <select v-model="pageTemplateId">
          <option disabled hidden selected value="-1">Choose a Template</option>
          <option value="0">Blank Page</option>
          <option v-for="pt in pageTemplates"
            :value="pt.id">{{ pt.title }}</option>
        </select>
      </div>
      <div v-if="editMode">
        <h3>Deal Status</h3>
        <select v-model="status"
          class="flex-grow">
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="opt-out">Archive</option>
        </select>
      </div>
      <div v-if="editMode">
        <h3>Show Pricing?</h3>
        <input type="checkbox" v-model="showPricing" class="!w-auto">
      </div>
      <div>
        <h3>Deal Amount</h3>
        <Money3Component
          v-model.number="dealAmount"
          class="flex-grow"
          v-bind="moneyConfig" />
      </div>
      <div>
        <h3>CRM Opportunity ID</h3>
        <input v-model="crmOpportunityId" 
          class="flex-grow mb-2"
          placeholder="Opportunity ID in CRM">
      </div>
      <div v-if="editMode">
        <h3>Publicly Visible?</h3>
        <input type="checkbox" v-model="isPublic" class="!w-auto">
      </div>
      <SubmitButton
        class="self-center"
        :ready-text="`${editMode ? 'Edit' : 'Add'} Account`"
        :submitting-text="`${editMode ? 'Editing' : 'Adding'} Account`"
        :submitted-text="`Account ${editMode ? 'Edited' : 'Added'}`"
        :error-text="`${editMode ? 'Editing' : 'Adding'} Account`"
        :submission-state="submissionState"
        :disabled="needsMoreInput"
        @click="submitFn" />
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useTemplatesStore } from '@/stores/templates'
import { Money3Component } from 'v-money3';
import lodash_pkg from 'lodash';
const { debounce } = lodash_pkg;

const props = defineProps({
  buyersphere: { type: Object, default: {}},
})

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const emit = defineEmits(['close'])

const editMode = ref(!!props.buyersphere.id)

const store = useBuyerspheresStore()

const templatesStore = useTemplatesStore()
const pageTemplates = ref([])
if (!editMode.value) {
  pageTemplates.value = await templatesStore.getPageTemplatesCached()
}

const { submissionState, submitFn } = useSubmit(async () => {
  if (editMode.value) {
    await store.saveBuyersphereSettings({
      buyersphereId: props.buyersphere.id,
      buyer,
      subname,
      buyerLogo,
      status,
      showPricing,
      dealAmount,
      crmOpportunityId,
      isPublic,
    })
    emit('close', { buyersphereId: props.buyersphere.id })
  } else {
    const buyersphereId = await store.createBuyersphere({ 
      buyer,
      subname,
      buyerLogo,
      dealAmount,
      crmOpportunityId,
      pageTemplateId: pageTemplateId ?? null, // if id = 0, send null
      pageTitle,
    })
    emit('close', { buyersphereId })
  }
})

const buyer = ref(props.buyersphere?.buyer)
const subname = ref(props.buyersphere?.subname)
const buyerLogo = ref(props.buyersphere?.buyerLogo)
const status = ref(props.buyersphere.status)
const pageTitle = ref('')
const pageTemplateId = ref(-1)
const crmOpportunityId = ref(props.buyersphere?.crmOpportunityId)
const dealAmount = ref(props.buyersphere?.dealAmount)
const showPricing = ref(props.buyersphere.showPricing)
const isPublic = ref(props.buyersphere.isPublic)

const needsMoreInput = computed(() => !buyer.value || !buyerLogo.value
  || (!editMode.value && (!pageTitle.value || pageTemplateId.value < 0)))

function isValidUrl (string) {
  try {
    return !!(new URL(string))
  } catch(ex) {
    return false
  }
}

const clearbitOptions = ref([])
const showClearbit = ref(false)

async function lookupOnClearbit () {
  if (isValidUrl(buyerLogo.value)) {
    clearbitOptions.value = []
    return;
  }

  const { data } = await useFetch(
    `https://autocomplete.clearbit.com/v1/companies/suggest?query=${buyerLogo.value}`
  )

  clearbitOptions.value = data.value
  showClearbit.value = true
}

const debouncedLookupOnClearbit = debounce(
  lookupOnClearbit, 
  500, 
  { leading: false, trailing: true },
)

function selectClearbitOption (logo) {
  buyerLogo.value = logo
  showClearbit.value = false
}
</script>

<style lang="postcss" scoped>
input {
  @apply w-full
}

.clearbit-options {
  @apply flex flex-col border-gray-border border rounded-md drop-shadow-md;
}

.clearbit-option {
  @apply flex flex-row gap-2 items-center p-2 bg-white w-[30rem];

  &:hover {
    @apply bg-gray-hover cursor-pointer;
  }
}
</style>
