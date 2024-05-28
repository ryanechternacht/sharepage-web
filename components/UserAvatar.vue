<template>
  <div v-if="unknown"
    :class="[ sizeClasses ]">
    <UIcon class="w-auto h-auto" name="i-heroicons-user" />
  </div>
  <img v-else-if="user.image"
    :class="[ sizeClasses ]"
    class="rounded-full"
    :src="user.image">
  <div v-else
    :class="[ sizeClasses ]"
    class="bg-blue-500 rounded-full center-xy h-8">
    <h3 class="dark mx-auto">{{ user.firstName[0] }}</h3>
  </div>
</template>

<script setup>
const props = defineProps({ 
  user: { type: Object, required: true },
  size: { type: String, default: 'medium' },
  unknown: { type: Boolean, default: false },
})

const sizeClasses = computed(() => ({
  'small': 'max-w-[1rem] max-h-[1rem] w-full',
  'medium': 'max-w-[1.5rem] max-h-6 w-full',
  'large': 'max-w-[2rem] max-h-8 w-full',
}[props.size ?? 'medium']))
</script>

<style lang="postcss" scoped>
</style>
