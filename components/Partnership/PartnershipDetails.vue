<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <img :src="myPartner.logo" class="h-8 max-w-16">
      <div class="text-3xl">{{ myPartner.name }}</div>
      <div class="flex-grow" />
      
      <a 
        v-if="myPartner.website"
        :href="myPartner.website"
        target="_blank"
        class="text-xs"
      >
        Partnership Website
      </a>
      <span v-if="myPartner.state === 'Active'" class="partnership-active">
        Partnership Accepted
      </span>
      <span v-else-if="myPartner.state === 'In Progress'" class="partnership-in-progress">
        Partnership Accepted
      </span>
      <span v-else-if="myPartner.state === 'Pending'" class="partnership-pending">
        Partnership Pending
      </span>
    </div>

    <div class="flex flex-row gap-2">
      <PButton
        @click="currentTab = 'joint-value'"
        :variant="currentTab === 'joint-value' ? 'primary' : ''">
        🪐 Joint Value
      </PButton>
      <PButton
        @click="currentTab = 'partner-value'"
        :variant="currentTab === 'partner-value' ? 'primary' : ''">
        🚀 Partner Value
      </PButton>
      <PButton
        @click="currentTab = 'resources'"
        :variant="currentTab === 'resources' ? 'primary' : ''">
        📓 Resources
      </PButton>
      <PButton
        @click="currentTab = 'leads'"
        :variant="currentTab === 'leads' ? 'primary' : ''">
        💎 Leads
      </PButton>      
      <PButton
        @click="currentTab = 'operations'"
        :variant="currentTab === 'operations' ? 'primary' : ''">
        🧰 Operations
      </PButton>

      <div class="flex-grow" />

      <template v-if="edit">
        <PButton
          @click="cancelEditing">
          ❌ Cancel
        </PButton>
        <PButton
          @click="save"
          variant="primary">
          💾 Save
        </PButton>
      </template>
      <template v-else>
        <PButton
          @click="edit = true">
          ✏️ Edit
        </PButton>
      </template>
    </div>
    
    <PartnershipJointValue
      v-if="currentTab === 'joint-value'" 
      :partner="myPartner"
      :edit="edit"
      @jointValueChanged="jointValueChanged"/>
    <PartnershipPartnerValue v-else-if="currentTab === 'partner-value'" :partner="myPartner"/>
    <PartnershipResources v-else-if="currentTab === 'resources'" :partner="myPartner"/>
    <PartnershipLeads v-else-if="currentTab === 'leads'" :partner="myPartner"/>
    <PartnershipOperations v-else-if="currentTab === 'operations'" :partner="myPartner"/>
  </div>
</template>

<script setup>
import { usePartnersStore } from '@/stores/partners'

const { savePartner } = usePartnersStore();

const props = defineProps({
  partner: Object
})

const edit = ref(false)
const currentTab = ref('joint-value')

const myPartner = ref(props?.partner)

function jointValueChanged(newValue) {
  myPartner.value.jointValue = newValue
}

function cancelEditing () {
  myPartner.value = props?.partner
  edit.value = false
}

function save () {
  edit.value = false;
  savePartner(myPartner.value)
}

watch(props, (newProps) => {
  myPartner.value = props.partner
})
</script>

<style lang="postcss" scoped>
a {
  @apply text-gray-500 underline;
}

.partnership-active, .partnership-in-progress {
  @apply text-blue-400 text-xs;
}

.partnership-pending {
  @apply text-orange-400 text-xs;
}
</style>