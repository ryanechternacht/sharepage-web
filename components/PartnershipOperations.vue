<template>
  <div class="flex flex-col gap-2">
    <div>
      <h3>General</h3>
      <div class="grid grid-cols-3 gap-x-4">
        <div class="partnership-fact">
          <label>Update Partnership Status:</label>
          <select v-model="partnershipStatus">
            <option></option>
            <option>Active</option>
            <option>Not Active</option>
            <option>In Progress</option>
          </select>
        </div>
        <div class="partnership-fact">
          <label>Update Partnership Type:</label>
          <select v-model="partnershipType">
            <option></option>
            <option>Channel</option>
            <option>Technology</option>
            <option>Strategic</option>
          </select>
        </div>
        <div class="partnership-fact">
          <label>Update Partnership Tier:</label>
          <select v-model="partnershipTier">
            <option></option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
          </select>
        </div>
      </div>
    </div>
    <div>
      <h3>Partner Agreements</h3>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col">
        <h3>Owners</h3>
        <PersonRow
          v-for="o in partner?.operations?.owners"
          :key="o.name"
          :person="o" />
      </div>
      <div class="flex flex-col">
        <h3>Contributors</h3>
        <PersonRow
          v-for="c in partner?.operations?.contributors"
          :key="c.name"
          :person="c" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  partner: Object
})

const partnershipStatus = ref(props.partner?.operations?.partnershipStatus)
const partnershipType = ref(props.partner?.operations?.partnershipType)
const partnershipTier = ref(props.partner?.operations?.partnershipTier)

// This feels unnecessary but it works
watch(props, (newProps) => {
  partnershipStatus.value = newProps.partner?.operations?.partnershipStatus
  partnershipType.value = newProps.partner?.operations?.partnershipType
  partnershipTier.value = newProps.partner?.operations?.partnershipTier
})
</script>

<style lang="postcss" scoped>
h3 {
  @apply font-bold;
}

.partnership-fact {
  @apply flex flex-col;

  label {
    @apply text-xs;
  }

  select {
    @apply text-gray-600 text-sm p-2;
  }
}

.owner {
  @apply flex flex-row gap-2 items-center p-2;

  &:hover {
    @apply rounded-lg bg-gray-100;
  }
}

.tag {
  @apply border-2 border-gray-300 rounded text-gray-500 text-xs p-1;
}
</style>