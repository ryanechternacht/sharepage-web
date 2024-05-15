<template>
  <VueFinalModal
    class="center-xy"
    content-class="p-4 bg-white rounded-md"
  >
    <div class="flex flex-col gap-2 w-[36rem]"
      @click="showClearbit = false">
      <div class="flex flex-row items-center mb-3">
        <h3 class="flex-grow">Create a Swaypage from this Template</h3>
        <BsButton @click="emit('close')">Cancel</BsButton>
      </div>
      <div>
        <h3>Account Name (required)</h3>
        <input v-model="buyer"
          class="flex-grow mb-2"
          placeholder="Buyer Name">
      </div>
      <div>
        <h3>Context (i.e. Sales Division)</h3>
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
      <div>
        <h3>Context (i.e. Sales Division)</h3>
        <div class="template-items">
          <div class="">First Name</div>
          <input v-model="firstName"
            placeholder="First Name">
          <div class="">Last Name</div>
          <input v-model="lastName"
            placeholder="Last Name">
          <div class="">Company</div>
          <input v-model="company"
            placeholder="Company">
          <div class="">Data 1</div>
          <input v-model="data1"
            placeholder="Data Item 1">
          <div class="">Data 2</div>
          <input v-model="data2"
            placeholder="Data Item 2">
          <div class="">Data 3</div>
          <input v-model="data3"
            placeholder="Data Item 3">
        </div>
      </div>
      <SubmitButton
        class="self-center"
        ready-text="Create"
        submitting-text="Creating"
        submitted-text="Created"
        error-text="Error Creating Swaypage"
        :submission-state="submissionState"
        :disabled="needsMoreInput"
        @click="submitFn" />
        {{ error }}
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { useSwaypagesStore } from '@/stores/swaypages'
import { Money3Component } from 'v-money3';
import lodash_pkg from 'lodash';
const { debounce } = lodash_pkg;

const props = defineProps({
  templateId: { type: Number, required: true },
  forDiscoveryRoom: { type: Boolean, default: false }
})

const moneyConfig = {
  precision: 0,
  prefix: '$ ',
  disableNegative: true,
  thousands: ',',
  suffix: ''
}

const emit = defineEmits(['close'])

const store = useSwaypagesStore()

const { submissionState, submitFn, error } = useSubmit(async () => {
  const id = await store.createSwaypageFromTemplate({
    templateId: props.templateId,
    buyer,
    subname,
    buyerLogo,
    templateData: {
      firstName,
      lastName,
      company,
      data1,
      data2,
      data3,
    }
  })
    emit('close', { swaypageId: id })
  }
)

const buyer = ref('')
const subname = ref('')
const buyerLogo = ref('')
const firstName = ref('')
const lastName = ref('')
const company = ref('')
const data1 = ref('')
const data2 = ref('')
const data3 = ref('')

const needsMoreInput = computed(() => !buyer.value)

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

.template-items {
  @apply grid items-center gap-y-2 gap-x-2;
  grid-template-columns: auto 1fr;
}
</style>
