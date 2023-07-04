<template>
  <div>
    <div class="bg-purple-lightest min-h-screen">
      <div class="sticky">
        <div class="flex flex-row items-center p-8 h-12 justify-between">
          <NuxtLink class="flex flex-row items-center" to="/" active-class="dont-match">
            <img src="/logo.svg">
            <h3>Buyersphere</h3>
          </NuxtLink>
          <div class="p-12 font-16">
            <NuxtLink to="/login">login</NuxtLink>
            👤
          </div>  
        </div>
      </div>
      <div class="px-8 pb-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
</style>