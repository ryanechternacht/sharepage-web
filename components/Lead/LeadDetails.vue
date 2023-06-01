<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <img :src="lead.logo" class="h-8 max-w-16">
      <div class="text-3xl">{{ lead.name }}</div>
      <div class="flex-grow" />

      <div :class="lead.approval.us && lead.approval.partner ? 'lead-accepted' : 'lead-pending'">
        {{ approvalMessage }}
      </div>
    </div>

    <div class="flex flex-row gap-2">
      <PButton 
        @click="currentTab = 'guidance'"
        :class="{selected: currentTab === 'guidance'}">
        👉 Guidance
      </PButton>
      <PButton 
        @click="currentTab = 'backdrop'"
        :class="{selected: currentTab === 'backdrop'}">
        🎨 Backdrop
      </PButton>
      <PButton 
        @click="currentTab = 'partnership'"
        :class="{selected: currentTab === 'partnership'}">
        🤝 Partnership
      </PButton>
      <PButton 
        @click="currentTab = 'resources'"
        :class="{selected: currentTab === 'resources'}">
        📓 Resources
      </PButton>      
      <PButton 
        @click="currentTab = 'operations'"
        :class="{selected: currentTab === 'operations'}">
        🧰 Operations
      </PButton>
    </div>

    <LeadGuidance v-if="currentTab === 'guidance'" :lead="lead"/>
    <LeadBackdrop v-else-if="currentTab === 'backdrop'" :lead="lead"/>
    <LeadPartnership v-else-if="currentTab === 'partnership'" :lead="lead"/>
    <LeadResources v-else-if="currentTab === 'resources'" :lead="lead"/>
    <LeadOperations v-else-if="currentTab === 'operations'" :lead="lead"/>
  </div>
</template>

<script setup>
const props = defineProps({
  lead: Object
})

const currentTab = ref('backdrop')

const approvalMessage = computed(() => {
  const { us, partner } = props.lead?.approval
  if (us && partner) {
    return 'Lead Accepted'
  } else if (us) {
    return `Lead Pending: Waiting on Account Team @ ${props.lead?.partner}`
  } else if (partner) {
    return 'Lead Pending: Waiting on Our Account Team'
  } else {
    return 'Lead Pending: Waiting on both Account Teams'
  }
})
</script>

<style lang="postcss" scoped>
.lead-pending {
  @apply text-orange-400 text-xs;
}

.lead-accepted {
  @apply text-blue-400 text-xs;
}
</style>
