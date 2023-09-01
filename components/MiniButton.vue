<template>
  <div class="cursor-pointer rounded-md bg-white flex flex-row items-center gap-x-1 px-2 py-[1px]">
    <div class="rounded-full w-2 h-2"
      :class="[bgColor]" />
    <span class="tag text-gray-darker">{{ text }}</span>
  </div>
</template>

<script setup>
const { text, color } = defineProps({ text: String, color: String })

const bgColor = computed(() => {
  return {
    'teal': 'bg-teal-bright',
    'orange': 'bg-orange-bright',
    'red': 'bg-red-bright'
  }[color ?? 'teal']
})
</script>

<style lang="postcss" scoped>
</style>