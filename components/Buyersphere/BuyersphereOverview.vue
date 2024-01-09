<template>
  <div 
    class="flex flex-col gap-y-4"
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
  >
    <div v-if="user.buyersphereRole === 'admin'">
      <div class="flex flex-row items-center justify-between">
        <h3>A message from {{ organization.name }}</h3>
        <div v-if="editing" class="flex flex-row gap-x-2">
          <BsButton
            color="teal"
            @click="save">Save</BsButton>
          <BsButton @click="dismissEdit">Dismiss</BsButton>
        </div>
        <img v-else
          src="/svg/edit.svg"
          class="row-icon"
          @click="edit">
      </div>
      <TipTapTextarea
        v-if="editing"
        v-model="editedIntroMessage"
        class="w-full" />
      <div v-else-if="buyersphere.introMessage"
        class="gray inline-html"
        v-html="buyersphere.introMessage" />
      <div v-else
        class="p-2 bg-gray-hover w-max rounded-md">
        <h3>Write a personal Introduction</h3>
        <BsButton 
          big
          class="bg-white w-[7rem]" 
          @click="edit">✍️ Write</BsButton>
      </div>
    </div>

    <div v-else-if="buyersphere.introMessage">
      <h3>A message from {{ organization.name }}</h3>
      <div class="gray inline-html" v-html="buyersphere.introMessage" />
    </div>

    <div>
      <h3>🚀 Who our product serves:</h3>
      <div>
        <ul>
          <li v-for="p in personas" class="gray">
            <span class="font-bold">{{ p.title }}:</span>
            {{ p.description }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <h3>✅ The problems we solve:</h3>
      <div>
        <ul>
          <li v-for="pp in painPoints" class="gray">
            <span class="font-bold">{{ pp.title }}:</span>
            {{ pp.description }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePainPointsStore } from '@/stores/pain-points'
import { usePersonasStore } from '@/stores/personas'
import { useUsersStore } from '@/stores/users'
import { useBuyerspheresStore } from '@/stores/buyerspheres'
import { useOrganizationStore } from '@/stores/organization'
import { storeToRefs } from 'pinia'

const painPointsStore = usePainPointsStore()
const { getPainPointsCached } = storeToRefs(painPointsStore)

const personasStore = usePersonasStore()
const { getPersonasCached } = storeToRefs(personasStore)

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const route = useRoute()
const buyersphereId = route.params.id

const buyersphereStore = useBuyerspheresStore()
const { getBuyersphereByIdCached,  } = storeToRefs(buyersphereStore)

const organizationStore = useOrganizationStore()
const { getOrganizationCached } = storeToRefs(organizationStore)

const [painPoints, personas, user, buyersphere, organization] = await Promise.all([
  getPainPointsCached.value(),
  getPersonasCached.value(),
  getMeCached.value(),
  getBuyersphereByIdCached.value(buyersphereId),
  getOrganizationCached.value(),
])

const editing = ref(false)
const editedIntroMessage = ref('')

function edit() {
  editing.value = true
  editedIntroMessage.value = buyersphere.introMessage
}

async function save() {
  editing.value = false
  await buyersphereStore.saveIntroMessage({ buyersphereId, introMessage: editedIntroMessage.value })
}

function dismissEdit() {
  editing.value = false
}
</script>

<style lang="postcss" scoped>
h3 {
  @apply mb-2;
}

li {
  @apply list-disc ml-3;
}
</style>
