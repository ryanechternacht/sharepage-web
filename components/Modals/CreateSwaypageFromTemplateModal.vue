<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Create Swaypage from this Template
        </h2>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Name *</div>
          <UInput
            v-model="buyer"
            placeholder="Account Name" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Logo *</div>
          <USelectMenu
            v-model="clearbitLogo"
            :loading="clearbitLoading"
            :searchable="lookupOnClearbit"
            by="domain"
            placeholder="Search for a company"
            option-attribute="domain">
            <template #option="{ option: { name, logo, domain } }">
              <div class="flex flex-row gap-2 items-center p-2">
                <img :src="logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
                <div class="grow">{{ name }}</div>
                <div class="shrink-0 tag">{{ domain }}</div>
              </div>
            </template>
          </USelectMenu>
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Context</div>
          <UInput
            v-model="subname"
            placeholder="Sales Divison, Team, etc" 
            class="w-full" />
        </div>
        <div>
          <h3 class="mb-2">Template Data</h3>
          <div class="text-sm text-gray-subtext mb-1">First Name</div>
          <UInput
            v-model="firstName"
            placeholder="First Name" 
            class="mb-2" />
          <div class="text-sm text-gray-subtext mb-1">Last Name</div>
          <UInput
            v-model="lastName"
            placeholder="Last Name" 
            class="mb-2" />
          <div class="text-sm text-gray-subtext mb-1">Company</div>
          <UInput
            v-model="company"
            placeholder="Company Name" 
            class="mb-2" />
          <div class="text-sm text-gray-subtext mb-1">Data 1</div>
          <UInput
            v-model="data1"
            placeholder="Data 1" 
            class="mb-2" />
          <div class="text-sm text-gray-subtext mb-1">Data 2</div>
          <UInput
            v-model="data2"
            placeholder="Data 2" 
            class="mb-2" />
          <div class="text-sm text-gray-subtext mb-1">Data 3</div>
          <UInput
            v-model="data3"
            placeholder="Data 3" 
            class="mb-2" />
        </div>
        <SubmitButton 
          icon="i-heroicons-plus-circle"
          ready-text="Create"
          submitting-text="Creating"
          submitted-text="Created"
          error-text="Try Again"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" />
        {{ error }}
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'

const props = defineProps({
  templateId: { type: Number, required: true },
})

const emit = defineEmits(['close'])
const store = useSwaypagesStore()

const clearbitLoading = ref(false)
const clearbitLogo = ref(null)

const buyer = ref('')
const subname = ref('')
const firstName = ref('')
const lastName = ref('')
const company = ref('')
const data1 = ref('')
const data2 = ref('')
const data3 = ref('')

async function lookupOnClearbit (query) {
  clearbitLoading.value = true

  if (query) {
    const { data } = await useFetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`
    )
    clearbitLoading.value = false
    return data.value
  } else {
    clearbitLoading.value = false
    return []
  }
}

const { submissionState, submitFn, error } = useSubmit(async () => {
  const swaypageId = await store.createSwaypageFromTemplate({
    buyer,
    subname,
    buyerLogo: clearbitLogo.logo,
    templateId: props.templateId,
    templateData: {
      firstName,
      lastName,
      company,
      data1,
      data2,
      data3,
    }
  })
  emit('close', { swaypageId })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)

</script>