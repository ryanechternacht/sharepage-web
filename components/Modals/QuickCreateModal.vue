<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Quick Create a Sharepage
        </h2>
        <UFormGroup label="Account Name" required>
          <UInput v-model="accountName"
            placeholder="Account Name" />
        </UFormGroup>

        <UFormGroup label="Account Website" required>
          <UInput v-model="accountWebsite"
            placeholder="Account Website"
            @blur="setClearbitLogoFromDomain" />
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

        <UFormGroup label="Lead Name" required>
          <UInput v-model="leadName"
            placeholder="Lead Name" />
        </UFormGroup>

        <UFormGroup label="Lead Job Title" required>
          <UInput v-model="leadJobTitle"
            placeholder="Lead Job Title" />
        </UFormGroup>

        <UFormGroup label="Lead Location">
          <UInput v-model="leadLocation"
            placeholder="Lead Location" />
        </UFormGroup>

        <UAccordion :items="accordionItems" variant="soft">
          <template #your-details>
            <div class="flex flex-col gap-4">
              <UFormGroup label="Your Name" required>
                <UInput v-model="sellerName"
                  placeholder="Your Name" />
              </UFormGroup>

              <UFormGroup label="Your Job Title" required>
                <UInput v-model="sellerJobTitle"
                  placeholder="Your Job Title" />
              </UFormGroup>

              <UFormGroup label="Your Company" required>
                <UInput v-model="sellerCompany"
                  placeholder="Your Company" />
              </UFormGroup>

              <UFormGroup label="Your Website" required>
                <UInput v-model="sellerWebsite"
                  placeholder="Your Website" />
              </UFormGroup>
            </div>
          </template>
        </UAccordion>

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
import { useOrganizationStore } from '@/stores/organization'
import { useUsersStore } from '@/stores/users'
import { useSharepagesStore } from '@/stores/sharepages'
import { storeToRefs } from 'pinia'

const props = defineProps({
  templateId: { type: Number, required: true },
})

const emit = defineEmits(['close'])
const store = useSharepagesStore()

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const { getSharepageByIdCached } = storeToRefs(store)

const [organization, user, template] = await Promise.all([
  getOrganizationCached.value(),
  getMeCached.value(),
  getSharepageByIdCached.value(props.templateId),
])

const clearbitLoading = ref(false)
const clearbitLogo = ref(null)

const accountName = ref('')
const accountWebsite = ref('')
const leadName = ref('')
const leadJobTitle = ref('')
const leadLocation = ref('')

const accordionItems = [{
  label: 'Your Details',
  icon: 'i-heroicons-user',
  defaultOpen: false,
  slot: 'your-details'
}]

const sellerName = ref(user.firstName)
const sellerJobTitle = ref(user.displayRole)
const sellerCompany = ref(organization.name)
const sellerWebsite = ref(organization.domain)

function setClearbitLogoFromDomain() {
  if (!clearbitLogo.value && URL.canParse(accountWebsite.value)) {
    const url = URL.parse(accountWebsite.value)

    const parts = url.hostname.split('.')
    const domain = parts.slice(-2).join('.')

    clearbitLogo.value = { logo: `https://logo.clearbit.com/${domain}` }
  }
}

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
  const templateData = { 
    accountName, 
    accountWebsite,
    leadName, 
    leadJobTitle, 
    leadLocation, 
    sellerName, 
    sellerJobTitle,
    sellerCompany, 
    sellerWebsite,
  }

  const sharepageId = await store.createSharepageFromGlobalTemplate({
    buyer: accountName,
    subname: `For ${leadName.value}`,
    buyerLogo: clearbitLogo.value.logo,
    templateData,
  })
  await store.invalidateAllSharepageCache()
  emit('close', { sharepageId })
})

const needsMoreInput = computed(() => 
  !accountName.value || !accountWebsite.value || !clearbitLogo.value
  || !leadName.value || !leadJobTitle.value || !sellerName.value
  || !sellerJobTitle.value || !sellerCompany.value || !sellerWebsite.value)
</script>

<style lang="postcss" scoped>
</style>
