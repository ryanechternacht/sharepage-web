<template>
<!-- // TODO we should pick the correct one -->
  <PartnershipDetails :partner="partners[0]"/>
</template>

<script setup>
import { usePartnersStore } from '@/stores/partners'
import { storeToRefs } from 'pinia'

const { partners } = storeToRefs(usePartnersStore())

</script>