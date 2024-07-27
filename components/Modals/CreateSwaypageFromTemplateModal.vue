<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Create Sharepage from this Template
        </h2>
        <UFormGroup label="Name" required>
          <UInput v-model="buyer"
            placeholder="Account Name" />
        </UFormGroup>

        <UFormGroup label="Logo"
          required
          help="Paste a link or type to search Clearbit for logos">
          <USelectMenu
            v-model="clearbitLogo"
            :loading="clearbitLoading"
            :searchable="lookupOnClearbit"
            by="logo"
            placeholder="Search for a company"
            option-attribute="logo"
            creatable>
            <template #option="{ option: { name, logo, domain } }">
              <div class="flex flex-row gap-2 items-center p-2">
                <img :src="logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
                <div class="grow">{{ name }}</div>
                <div class="shrink-0 tag">{{ domain }}</div>
              </div>
            </template>
            <template #option-create="{ option }">
              <span class="flex-shrink-0">Use Url:</span>
              <Logo class="max-h-[1.25rem] h-full w-full max-w-[1.25rem] flex-shrink-0" :src="option.logo" />
              <span class="flex-grow block truncate text-gray-400 min-w-[8rem]">{{ option.logo }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="Context">
          <UInput v-model="subname"
            placeholder="Sales Divison, Team, etc" 
            class="w-full" />
        </UFormGroup>

        <h3>Template Data</h3>
        
        <UFormGroup label="Account Name">
          <UInput v-model="accountName"
            placeholder="Account Name" />
        </UFormGroup>
        
        <UFormGroup label="First Name">
          <UInput v-model="firstName"
            placeholder="First Name" />
        </UFormGroup>

        <UFormGroup label="Last Name">
          <UInput v-model="lastName"
            placeholder="Last Name" />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput v-model="email"
            placeholder="Email" />
        </UFormGroup>

        <UFormGroup label="Domain">
          <UInput v-model="domain"
            placeholder="Domain" />
        </UFormGroup>

        <UFormGroup v-for="(variable, index) in variables"
          :label="template.templateCustomVariables[index]">
          <UInput :model-value="variable"
            :placeholder="template.templateCustomVariables[index]"
            @update:model-value="v => variables[index] = v" />
        </UFormGroup>

          <!-- <div class="text-sm text-gray-500 mb-1">Field 1</div>
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
            class="mb-2" /> -->
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
          {{ error }}
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { storeToRefs } from 'pinia'
import lodash_pkg from 'lodash';
const { forEach, map } = lodash_pkg;

const props = defineProps({
  templateId: { type: Number, required: true },
})

const emit = defineEmits(['close'])
const store = useSwaypagesStore()

const { getSwaypageByIdCached } = storeToRefs(store)

const template = await getSwaypageByIdCached.value(props.templateId)

const clearbitLoading = ref(false)
const clearbitLogo = ref(null)

const buyer = ref('')
const subname = ref('')
const accountName = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const domain = ref('')

const variables = ref(map(template.templateCustomVariables, v => ''))

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

const { submissionState, submitFn, error } = useSubmit(async () => {
  const templateData = { accountName, firstName, lastName, email, domain }
  forEach(variables.value, (v, i) => {
    templateData[`field${i+1}`] = v
  })

  const swaypageId = await store.createSwaypageFromTemplate({
    buyer,
    subname,
    buyerLogo: clearbitLogo.value.logo,
    templateId: props.templateId,
    templateData,
  })
  await store.invalidateAllSwaypageCache()
  emit('close', { swaypageId })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)
</script>
