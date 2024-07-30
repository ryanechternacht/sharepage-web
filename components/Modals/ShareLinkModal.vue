<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <UTabs v-model="selectedTab" :items="tabs" />

        <UAlert v-if="!sharepage.isPublic"
          title="This Sharepage isn't publicly viewable"
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
            :url="personalizedLink" />
        </template>

        <template v-else-if="selectedTab === 1">
          <CopyToClipboardButton :url="generalLink"/>
        </template>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { useSharepagesStore } from '@/stores/sharepages'

const props = defineProps({
  sharepage: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const tabs = [{ label: 'Personal' }, { label: 'General' }]
const selectedTab = ref(0)

const recipient = ref('')

const { 
  makeExternalSharepageLink, 
  makePersonalizedExternalSharepageLink,
} = useSharepageLinks()

const requestUrl = useRequestURL()

const personalizedLink = computed(() =>  
  makePersonalizedExternalSharepageLink(
    requestUrl,
    props.sharepage.shortcode,
    recipient.value
  )
)

const generalLink = makeExternalSharepageLink(
  requestUrl,
  props.sharepage.shortcode,
  props.sharepage.buyer
)

const store = useSharepagesStore()
async function makePublic() {
  await store.saveSharepageSettings({
    sharepageId: props.sharepage.id,
    isPublic: true,
  })
}
</script>