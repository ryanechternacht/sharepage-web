<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <UTabs v-model="selectedTab" :items="tabs" />

        <UAlert v-if="!swaypage.isPublic"
          title="This Swaypage isn't publicly viewable"
          color="orange"
          variant="subtle"
          :actions="[{
            label: 'Make Public',
            click: makePublic,
            color: 'orange',
            icon: 'i-heroicons-eye',
            variant: 'solid'
          }]" />

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
import { useSwaypagesStore } from '@/stores/swaypages'

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

const store = useSwaypagesStore()
async function makePublic() {
  await store.saveSwaypageSettings({
    swaypageId: props.swaypage.id,
    isPublic: true,
  })
}
</script>