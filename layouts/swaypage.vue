<template>
  <div>
    <TopNavNew>
      <template #action-button>
        <!-- TODO click handler -->
       <SpButton>
        <template #icon>
          <Link2Icon />
        </template>
        Share
       </SpButton>
      </template>
    </TopNavNew>
    <div class="mt-6 page-grid">
      <div class="mr-4">
        <div class="sticky top-8">
          <div class="header-grid">
            <img src="/house_greyjoy.jpeg" class="icon-header">
            <h2>House Greyjoy</h2>
            <StarIcon class="icon-menu justify-self-center" />
            <div class="subtext">Sales Division</div>
          </div>
          <div class="mt-[2.25rem] flex flex-col">
            <NuxtLink v-for="p in pages"
              :href="makeDemoSwaypageLink(swaypage, p.id)"
              class="sidebar-item">
              <!-- TODO reimplement custom icons -->
              <!-- <div class="icon-header center-xy">
                <component :is="p.icon" class="icon-menu" />
              </div> -->
              <FileIcon class="icon-menu" />
              <div>{{ p.title }}</div>
            </NuxtLink>
            <div class="sidebar-item"
              @click="newPage">
              <div class="icon-header center-xy">
                <PlusSquareIcon class="text-gray-medium" />
              </div>
              <div class="text-gray-medium">New Page</div>
            </div>
          </div>
        </div>
      </div>

      <slot />
    </div>

    <div class="h-[5rem]" /> <!-- bottom spacer -->
  </div>
</template>

<script setup>
import { useSwaypagesStore } from '@/stores/swaypages'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const route = useRoute()
const swaypageId = parseInt(route.params.id)

const swaypageStore = useSwaypagesStore()
const { getSwaypageByIdCached, getSwaypagePagesByIdCached } = storeToRefs(swaypageStore)

const usersStore = useUsersStore()
const { isUserLoggedIn, isUserSeller } = storeToRefs(usersStore)

const [swaypage, pages, hasUser, isSeller] = await Promise.all([
  getSwaypageByIdCached.value(swaypageId),
  getSwaypagePagesByIdCached.value(swaypageId),
  isUserLoggedIn.value(),
  isUserSeller.value(),
])

const router = useRouter()
// switch back to makeInternalSwaypageLink
const { makeDemoSwaypageLink } = useSwaypageLinks()

function nav(page) {
  pages.value.forEach(p => p.selected = false)
  page.selected = true
}

function newPage () {
  pages.value.push({
    title: "Notes (such as research notes)",
    icon: resolveComponent("WifiIcon"),
  })
}
</script>

<style lang="postcss" scoped>
.header-grid {
  @apply grid items-center gap-x-2 gap-y-2;
  grid-template-columns: auto 1fr;
}

.sidebar-item {
  @apply py-2 my-1 cursor-pointer flex flex-row gap-2 items-center;

  &.router-link-active {
    @apply bg-gray-background rounded-md py-3 my-0 px-2 -mx-2;

    .text-subtext {
      @apply font-semibold;
    }
  }
}

.page-grid {
  @apply grid mx-8;
  /* TODO, I can probably improve these a bit using some minmax() */
  /* ideal is ~350 710 220 */
  grid-template-columns: 3fr 6.5fr 2fr;
}
</style>
