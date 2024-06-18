<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Create Swaypage from this Template
        </h2>
        <div>
          <div class="text-sm text-gray-500 mb-1">Name *</div>
          <UInput
            v-model="buyer"
            placeholder="Account Name" 
            class="w-full" />
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Logo *</div>
          <USelectMenu
            v-model="clearbitLogo"
            :loading="clearbitLoading"
            :searchable="lookupOnClearbit"
            by="domain"
            placeholder="Search for a company"
            option-attribute="domain"
            creatable>
            <template #option="{ option: { name, logo, domain } }">
              <div class="flex flex-row gap-2 items-center p-2">
                <img :src="logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
                <div class="grow">{{ name }}</div>
                <div class="shrink-0 tag">{{ domain }}</div>
              </div>
            </template>
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Url Entered:</span>
              <Logo class="max-h-[1.25rem] h-full w-full max-w-[1.25rem] flex-shrink-0" :src="option.logo" />
              <span class="flex-grow block truncate text-gray-400">{{ option.logo }}</span>
            </template>
          </USelectMenu>
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">Context</div>
          <UInput
            v-model="subname"
            placeholder="Sales Divison, Team, etc" 
            class="w-full" />
        </div>
        <div>
          <h3 class="mb-2">Template Data</h3>
          <div class="text-sm text-gray-500 mb-1">Account Name</div>
          <UInput
            v-model="accountName"
            placeholder="Account Name" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">First Name</div>
          <UInput
            v-model="firstName"
            placeholder="First Name" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Last Name</div>
          <UInput
            v-model="lastName"
            placeholder="Last Name" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Email</div>
          <UInput
            v-model="email"
            placeholder="Email" 
            class="mb-2" />
            <div class="text-sm text-gray-500 mb-1">Domain</div>
          <UInput
            v-model="domain"
            placeholder="Domain" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Field 1</div>
          <UInput
            v-model="field1"
            placeholder="Field 1" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Field 2</div>
          <UInput
            v-model="field2"
            placeholder="Field 2" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Field 3</div>
          <UInput
            v-model="field3"
            placeholder="Field 3" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Field 4</div>
          <UInput
            v-model="field4"
            placeholder="Field 4" 
            class="mb-2" />
          <div class="text-sm text-gray-500 mb-1">Field 5</div>
          <UInput
            v-model="field5"
            placeholder="Field 5" 
            class="mb-2" />
        </div>
        <SubmitButton 
          icon="i-heroicons-plus"
          block
          ready-text="Create"
          submitting-text="Creating"
          submitted-text="Created"
          error-text="Try Again"
          :disabled="needsMoreInput"
          :submissionState="submissionState"
          @click="submitFn" />
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
const accountName = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const domain = ref('')
const field1 = ref('')
const field2 = ref('')
const field3 = ref('')
const field4 = ref('')
const field5 = ref('')

async function lookupOnClearbit (query) {
  clearbitLoading.value = true

  if (query) {
    const data = await $fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`
    )
    clearbitLoading.value = false
    return data
  } else {
    clearbitLoading.value = false
    return []
  }
}

const { submissionState, submitFn } = useSubmit(async () => {
  const swaypageId = await store.createSwaypageFromTemplate({
    buyer,
    subname,
    buyerLogo: clearbitLogo.value.logo,
    templateId: props.templateId,
    templateData: {
      accountName,
      firstName,
      lastName,
      email,
      domain,
      field1,
      field2,
      field3,
      field4,
      field5,
    }
  })
  await store.invalidateAllSwaypageCache()
  emit('close', { swaypageId })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)

</script>