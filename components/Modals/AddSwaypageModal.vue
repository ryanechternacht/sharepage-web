<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          New Swaypage
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
        <SubmitButtonNew 
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

const emit = defineEmits(['close'])
const store = useSwaypagesStore()

const clearbitLoading = ref(false)
const clearbitLogo = ref(null)
const subname = ref('')

const buyer = ref('')

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
  const swaypageId = await store.createSwaypage({
    buyer,
    subname,
    buyerLogo: clearbitLogo.logo,
    roomType: 'deal-room',
    pageTitle: 'New Page'
  })
  emit('close', { swaypageId })
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)

</script>