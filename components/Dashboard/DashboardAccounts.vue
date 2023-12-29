<template>
  <div class="[grid-area:left-header] left-header">
    <!-- left-header -->
  </div>

  <div class="[grid-area:center-header] center-header">
    <!-- center-header -->
  </div>

  <div class="[grid-area:left]">
    <div class="left-sidebar">
      <div class="page-link"
        @click="navigateTo(`/dashboard/activities`)">Activities</div>
      <h3 class="page-link">Accounts</h3>
      <!-- <div v-scroll-spy-active v-scroll-spy-link class="mt-[-.75rem] mb-[.75rem]">
        <h4 v-if="overdueItems.length" 
          @click="navigateTo('#overdue')"
          class="in-page-link">Overdue</h4>
        <h4 v-if="next7DaysItems.length" 
          @click="navigateTo('#next-7-days')"
          class="in-page-link">Next 7 Days</h4>
        <h4 v-if="next30DaysItems.length" 
          @click="navigateTo('#next-30-days')"
          class="in-page-link">Next 30 Days</h4>
        <h4 v-if="next90DaysItems.length" 
          @click="navigateTo('#next-90-days')"
          class="in-page-link">Next 90 Days</h4>
        <h4 v-if="beyondItems.length" 
          @click="navigateTo('#beyond')"
          class="in-page-link">Beyond</h4>
        <h4 v-if="completedItems.length" 
          @click="navigateTo('#completed')"
          class="in-page-link">Completed</h4>
      </div> -->
      <div class="page-link"
        @click="navigateTo(`/dashboard/insights`)">Insights</div>
    </div>
  </div>

  <div class="[grid-area:center] page-center" v-scroll-spy>
    <div class="section">
      <div class="group-header">Accounts</div>
      <div class="item-count">
        {{ buyerspheres.length === 1 ? '1 account' : `${buyerspheres.length} accounts`}}
      </div>
      <div class="mt-[2rem] flex flex-col gap-4">
        <div v-for="bs in buyerspheres"
          class="item-list-row"
          @click="navigateTo(`/buyersphere/${bs.id}`)">
          <Logo :src="bs.buyerLogo" />
          <h3>{{ bs.buyer }}</h3>
          <div class="flex-grow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useNuxtApp()
const { data: buyerspheres, refresh } = await apiFetch('/v0.1/buyerspheres', { 
  // query
})

</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);
  }
}
</style>
