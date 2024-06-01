<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <UTabs v-model="selectedTab" :items="tabs" />

        <template v-if="selectedTab === 0">
          <div>
            <div class="text-sm text-gray-500 mb-1">Name *</div>
            <UInput
              v-model="recipient"
              placeholder="Recipient's Name" 
              class="w-full" />
          </div>
          <CopyToClipboardButton
            :url="personalizedLink"
            :swaypage-id="swaypage.id" />
        </template>

        <template v-else-if="selectedTab === 1">
          <CopyToClipboardButton :url="generalLink"/>
        </template>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  swaypage: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const tabs = [{ label: 'Personal' }, { label: 'General' }]
const selectedTab = ref(0)

const recipient = ref('')

const { 
  makeExternalSwaypageLink, 
  makePersonalizedExternalSwaypageLink,
} = useSwaypageLinks()

const requestUrl = useRequestURL()

const personalizedLink = computed(() =>  
  makePersonalizedExternalSwaypageLink(
    requestUrl,
    props.swaypage.shortcode,
    recipient.value
  )
)

const generalLink = makeExternalSwaypageLink(
  requestUrl,
  props.swaypage.shortcode,
  props.swaypage.buyer
)
</script>