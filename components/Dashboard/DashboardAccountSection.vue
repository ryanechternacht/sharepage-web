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

        <!-- this is to align the 2 text sizes to baseline to look better -->
        <div class="flex flex-row items-end gap-4">
          <h3>{{ a.buyer }}</h3>
          <div v-if="a.subname" class="tag">{{ a.subname }}</div>
        </div>
        <div class="flex-grow" />
        
        <div
          class="show-on-row-hover flex flex-row gap-4 items-center">
          <BsButton v-if="a.status !== 'active'"
            hover-color="blue"
            @click.stop="changeDealStatus(a, 'active')">
            <span class="tag-header">Reactivate</span>
          </BsButton>
          <BsButton v-if="a.status !== 'on-hold'"
            hover-color="red"
            @click.stop="changeDealStatus(a, 'on-hold')">
            <span class="tag-header">Put on Hold</span>
          </BsButton>
          <BsButton v-if="a.status !== 'opt-out'"
            hover-color="red"
            @click.stop="changeDealStatus(a, 'opt-out')">
            <span class="tag-header">Archive</span>
          </BsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { makeBuyersphereLink } = useBuyersphereLinks()

const props = defineProps({ accounts: { type: Array, required: true }})

const emit = defineEmits(['update:deal-status'])

const statusMap = {
  'active': "Are you sure you want to reactivate this deal?",
  'on-hold': "Are you sure you'd like to put this deal on hold?",
  'opt-out': "Are you sure you'd like to archive this deal?"
}

async function changeDealStatus (account, status) {
  const answer = confirm(statusMap[status])

  if (answer) {
    emit('update:deal-status', { account, status })
  }
}
</script>

<style lang="postcss" scoped>
.item-list-row {
  @apply w-full flex flex-row items-center gap-2 h-[1.75rem];

  &:hover {
    @apply cursor-pointer bg-gray-hover px-4 mx-[-1rem] py-2 my-[-.5rem]
      h-[2.75rem];
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