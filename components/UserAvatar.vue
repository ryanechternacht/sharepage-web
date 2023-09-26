<template>
  <img v-if="user.image"
    :class="[ sizeClass ]"
    class="rounded-full"
    :src="user.image">
  <div v-else 
    :class="[ sizeClass ]"
    class="bg-teal-primary rounded-full center-xy h-8">
    <h3 class="dark mx-auto">{{ user.firstName[0] }}</h3>
  </div>
</template>

<script setup>
const { user, size } = defineProps({ 
  user: { type: Object, required: true },
  size: { type: String, default: 'medium' }
})

const sizeClass = computed(() => {
  if (size === 'medium') return 'size-md'
  else if (size === 'large') return 'size-lg'
  else return 'size-md'
})
</script>

<style lang="postcss" scoped>
.size-md {
  @apply max-w-[1.5rem] max-h-6 w-full;
}

.size-lg {
  @apply max-w-[2rem] max-h-8 w-full;
}

</style>