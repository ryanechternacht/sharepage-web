<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <h2 class="mx-auto">
          Edit Swaypage Settings
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
            by="logo"
            placeholder="Search for a company"
            option-attribute="logo">
            <template #option="{ option: { name, logo, domain } }">
              <div class="flex flex-row gap-2 items-center p-2">
                <img :src="logo" class="w-[1.5rem] h-[1.5rem] shrink-0">
                <div class="grow">{{ name }}</div>
                <div class="shrink-0 tag">{{ domain }}</div>
              </div>
            </template>
          </USelectMenu>
          {{ clearbitLogo }}
        </div>
        <div>
          <div class="text-sm text-gray-subtext mb-1">Context</div>
          <UInput
            v-model="subname"
            placeholder="Sales Divison, Team, etc" 
            class="w-full" />
        </div>
        <!-- status -->
        <div>
          <div class="text-sm text-gray-subtext mb-1">Visibility</div>
          <USelect
            v-model="isPublic"
            :options="visibilityOptions"
             />
        </div>
        <!-- Visibility -->
        <!-- Room Type? -->
        <SubmitButtonNew 
          icon="i-heroicons-plus-circle"
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
  swaypage: { type: Object, required: true }
})

const emit = defineEmits(['close'])
const store = useSwaypagesStore()

const clearbitLoading = ref(false)
const clearbitLogo = ref({ logo: props.swaypage.buyerLogo })

const buyer = ref(props.swaypage.buyer)
const subname = ref(props.swaypage.subname)

const isPublic = ref(props.swaypage.isPublic)
const visibilityOptions = [
  {
    label: 'Public',
    value: true,
  }, {
    label: 'Private',
    value: false,
  },
]

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
  await store.saveSwaypageSettings({
    swaypageId: props.swaypage.id,
    buyer,
    subname,
    buyerLogo: clearbitLogo.value.logo,
    roomType: 'deal-room',
    pageTitle: 'New Page'
  })
  emit('close')
})

const needsMoreInput = computed(() => !buyer.value || !clearbitLogo.value)

</script>