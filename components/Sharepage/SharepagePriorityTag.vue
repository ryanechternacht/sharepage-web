<template>
  <div class="py-.5 px-2 flex flex-row gap-2 items-center">
    <UIcon name="i-heroicons-bell"
      :class="[priorityTag[priority].color]" />
    <span class="subtext">
      {{ priorityTag[priority].text }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  priority: { type: Number, required: true }
})

const priorityTag = {
  1: { 
    text: 'High',
    color: 'text-blue-500',
  },
  2: { 
    text: 'Normal',
    color: 'text-gray-500',
  },
  3: { 
    text: 'Low',
    color: 'text-gray-300',
  },
}
</script>

<style lang="postcss" scoped>
.small-text {
  font-size: .625rem;
}
</style>
