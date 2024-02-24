<template>
  <div id="active" class="section">
    <div class="group-header">Active Deals</div>
    <div class="item-count">
      {{ accounts.length === 1 ? '1 account' : `${accounts.length} accounts`}}
    </div>
    <div class="mt-[2rem] flex flex-col gap-4">
      <div v-for="a in accounts"
        class="item-list-row"
        @click="navigateTo(makeBuyersphereLink(a))">
        <Logo :src="a.buyerLogo" />
        <h3>{{ a.buyer }}</h3>
        <div v-if="a.subname" class="tag">{{ a.subname }}</div>
        <div class="flex-grow" />
        
        <!-- <div v-if="a.status === 'active'"
          class="show-on-row-hover flex flex-row gap-4 items-center">
          <BsButton><span class="body-header">Put on Hold</span></BsButton>
          <BsButton><span class="body-header">Archive</span></BsButton>
        </div>
        <BsButton v-else>Reactivate</BsButton> -->
      </div>
    </div>
  </div>
</template>

<script setup>
const { makeBuyersphereLink } = useBuyersphereLinks()

const props = defineProps({ accounts: { type: Array, required: true }})
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2;

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem];
    width: calc(100% + 2rem);

    .show-on-row-hover {
      @apply [display:inherit];
    }
  }
}

.show-on-row-hover {
  @apply hidden;
}
</style>