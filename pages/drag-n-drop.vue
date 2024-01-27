<template>
  <div class="grid grid-cols-2">
    <div>
      <draggable 
        :list="list" 
        group="people" 
        ghost-class="ghost"
        item-key="id"
        v-bind="dragOptions"
        @start="drag=true" 
        @end="drag=false" 
        >
        <template #item="{ element }">
          <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
            {{ element.name }}
          </div>
        </template>
      </draggable>
      <br>
      <br>
      {{ list }}
    </div>
    <div>
      <draggable 
        :list="list2" 
        group="people" 
        ghost-class="ghost"
        item-key="id"
        v-bind="dragOptions"
        @start="drag=true" 
        @end="drag=false" 
        >
        <template #item="{ element }">
          <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
            {{ element.name }}
          </div>
        </template>
      </draggable>
      <br>
      <br>
      {{ list2 }}
    </div>
  </div>
</template>

<script setup>
const drag = ref(false)

const list = ref([
  { name: "John", id: 0 },
  { name: "Joao", id: 1 },
  { name: "Jean", id: 2 }
])
const list2 = ref([
  { name: "John 2", id: 3 },
  { name: "Joao 2", id: 4 },
  { name: "Jean 2", id: 5 }
])

const dragOptions = ref({
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
})

</script>

<style lang="postcss" scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  /* background-color: red; */
  /* border: 4px solid black; */
}

</style>
