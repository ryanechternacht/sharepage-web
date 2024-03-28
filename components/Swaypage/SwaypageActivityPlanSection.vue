<template>
  <div class="section">
    <div class="group-header">
      <div class="h-[1.5rem]">{{ !isGlobalList ? milestone.title : header }}</div> 
      <div v-if="milestone?.resolved" class="italic tag">
        (Completed)</div>
      <template v-if="!isGlobalList && hasUser">
        <template v-if="!isTemplate">
          <BsButton v-if="!milestone.resolved" 
            hover-color="blue"
            class="show-on-hover"
            @click="emit('resolve:milestone', { milestone })">
            <CheckCircleIcon />
          </BsButton>
          <BsButton v-else
            hover-color="blue"
            class="show-on-hover"
            @click="emit('unresolve:milestone', { milestone })">
            <RotateCcwIcon />
          </BsButton>
        </template>
        <EditButton @click="emit('update:milestone', { milestone })" class="show-on-hover" />
        <DeleteButton @click="emit('delete:milestone', { milestone })" class="show-on-hover" />
      </template>
    </div>
    <div v-if="activities.length" class="item-count">
      <span v-if="isTemplate">
        {{ activities.length === 1 ? "1 activity" : `${activities.length} activities` }}
      </span>
      <span v-else>
        {{ completed }} / {{ activities.length }} completed
      </span>
    </div>
    <!-- <VueDraggable 
      v-model="milestone.activities" 
      group="activities"
      ghost-class="ghost"
      animation="200"
      item-key="id"
      class="mt-[2rem] flex flex-col gap-4"
      handle=".drag-handle"
    > -->
    <div class="mt-[2rem] flex flex-col gap-4">
      <SwaypageActivityItem
        v-for="activity in activities"
        :key="activity.id"
        :activity="activity"
        :is-global-list="isGlobalList"
        :is-template="isTemplate"
        @update:activity="args => emit('update:activity', args)"
        @delete:activity="args => emit('delete:activity', args)"
        @resolve:activity="args => emit('resolve:activity', args)"
        @click:activity="args => emit('click:activity', args)" />
    </div>
    <!-- </VueDraggable> -->
    <NewButton v-if="!isGlobalList"
      class="section-add-button"
      @click="emit('create:activity', { milestoneId: milestone.id })" />
  </div>
</template>

<script setup>
import lodash_pkg from 'lodash';
const { filter } = lodash_pkg;

const props = defineProps({
  milestone: { type: Object },
  activities: { type: Array, required: true },
  isGlobalList: { type: Boolean, default: false },
  isTemplate: { type: Boolean, default: false },
  header: { type: String },
  hasUser: { type: Boolean, default: true },
})

const emit = defineEmits([
  'update:milestone',
  'resolve:milestone',
  'unresolve:milestone',
  'delete:milestone',
  'create:activity',
  'update:activity',
  'resolve:activity',
  'delete:activity',
])

const completed = computed(() => 
  filter(props.activities, a => a.resolved).length)
</script>

<style lang="postcss" scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  /* background-color: red; */
  /* border: 4px solid black; */
}

.show-on-hover {
  @apply hidden;
}

*:has(> .show-on-hover):hover {
  .show-on-hover {
    @apply block;
  }
}
</style>
