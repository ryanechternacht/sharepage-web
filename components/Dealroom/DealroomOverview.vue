<template>
  <div class="overview-grid">
    <template
      v-for="(s, i) in overview?.sections"
    >
      <div
        :class="{ 'col-span-1': i === 0,
                  'col-span-2': i }"
      >
        <h3>{{ s.prompt }}</h3>
        <EditableTextarea
        v-if="s.type === 'text'"
        :text="s.answer"
        :edit="edit"
        />
        <EditableList
        v-if="s.type === 'list'"
        :items="s.answers"
        :edit="edit"
        />
      </div>
      <div
        v-if="i === 0"
      >
        <!-- TODO make this edit button work! -->
        edit 
      </div>  
    </template>
  </div>
</template>

<script setup>
const props = defineProps({ overview: Object })

const edit = ref(false)
</script>

<style lang="postcss" scoped>
.overview-grid {
  @apply grid gap-y-4 auto-rows-fr;
  grid-template-columns: 1fr auto;
}

h3 {
  @apply mb-2;
}
</style>
