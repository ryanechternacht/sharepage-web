<template>
  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <h3 class="page-link">Personal</h3>
      <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 class="in-page-link"
          @click="navigateTo('#profile')">Profile</h4>
        <h4 class="in-page-link"
          @click="navigateTo('#login-info')">Login Info</h4>
      </div>
      <div class="page-link"
        @click="navigateTo(`/settings/guide-template`)">Guide Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/timeline-template`)">Timeline Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/assets-template`)">Assets Template</div>
      <div class="page-link"
        @click="navigateTo(`/settings/admin`)">Admin</div>
    </div>
  </div>

  <div class="[grid-area:center]" v-scroll-spy>
  </div>
</template>

<script setup>
</script>
