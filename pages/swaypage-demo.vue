<template>
  <div class="grid custom-subgrid col-span-2">
    <div class="center-area">
      <div v-for="a in [1, 2, 3]"
        class="h-[50vh]">
        I'm real page content!
      </div>
    </div>
    <div class="ml-2">
      <div class="sticky top-[5.75rem]">
        <div class="mt-[5.75rem] flex flex-col gap-4 items-end">
          <div class="text-gray-medium">Key Links</div>
          <a v-for="link in links"
            class="rightbar-link"
            :href="link.link">
            <ExternalLinkIcon class="icon-menu" />
            <div>{{ link.text }}</div>
          </a>
          <div class="rightbar-link cursor-pointer">
            <MessageCircleIcon class="icon-menu" />
            <div class="">Please Opt Me Out</div>
          </div>
          <div class="rightbar-link cursor-pointer"
            @click="addNewLink">
            <PlusSquareIcon class="icon-menu text-gray-medium" />
            <div class="text-gray-medium">New Link</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'swaypage'
})

const links = ref([
  {
    text: 'Schedule a Call',
    link: 'https://www.google.com',
  },
  {
    text: 'Connect on LinkedIn',
    link: 'https://www.yahoo.com',
  },
  {
    text: 'See our Testemonials',
    link: 'https://www.microsoft.com',
  },
])

function addNewLink () {
  links.value.push({
    text: 'New Link',
    link: 'https://www.facebook.com',
  })
}
</script>

<style lang="postcss" scoped>
.center-area {
  @apply border border-gray-border-dark rounded-md px-2 py-1;
  /* TODO this is based on the current top nav height */
  min-height: calc(100vh - 5rem);
}

/* should be grid-cols-subgrid, but we need a newer tailwind */
.custom-subgrid {
  grid-template-columns: subgrid;
}

.rightbar-link {
  @apply flex flex-row-reverse items-center gap-3;

}
</style>
