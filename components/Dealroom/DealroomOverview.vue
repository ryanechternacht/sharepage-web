<template>
  <div class="flex flex-col gap-4">
    <div>
      <h3>🧙‍♀️ Why we think we’re better together</h3>
      <EditableTextarea
        :text="betterTogether"
        :edit="false"
      />
    </div>

    <div>
      <h3>🐙 The pain points we’re solving for</h3>
      <EditableTextarea
        :text="painPoints"
        :edit="false"
      />
    </div>

    <div>
      <h3>🤖 How our tools solve against your paint points</h3>
      <EditableTextarea
        :text="solution"
        :edit="false"
      />
    </div>

    <div>
      <h3>🔌 How our integration works</h3>
      <EditableTextarea
        :text="integration"
        :edit="false"
      />
    </div>

    <div>
      <h3>📓 Hand-picked resources</h3>
      <EditableList
        :items="resources"
        :edit="false"
      />
    </div>
  </div>
</template>

<script setup>
const betterTogether = 
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
   labore et dolore magna aliqua. Massa placerat duis ultricies lacus sed turpis tincidunt id 
   aliquet. Diam in arcu cursus euismod quis viverra nibh.`;

const painPoints = 
  `Eget duis at tellus at. Amet mauris commodo quis imperdiet. Non odio euismod lacinia at quis
   risus sed vulputate odio. Ut eu sem integer vitae justo. Urna duis convallis convallis tellus 
   id interdum. Pellentesque sit amet porttitor eget dolor morbi.`

const solution =
  `Enim nec dui nunc mattis enim ut. Massa placerat duis ultricies lacus sed turpis tincidunt id. 
   Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Vitae congue mauris 
   rhoncus aenean vel. Ac turpis egestas maecenas pharetra convallis posuere.`

const integration =
  `Ac tincidunt vitae semper quis. Tincidunt praesent semper feugiat nibh sed. Sed felis eget velit
  aliquet sagittis id. Cum sociis natoque penatibus et. A diam sollicitudin tempor id eu nisl nunc.`

const resources = ref([
  'Sodales neque sodales ut etiam sit amet', 
  'Et odio pellentesque diam volutpat commodo.', 
  'Viverra aliquet eget sit amet tellus cras adipiscing enim eu.'])
</script>

<style lang="postcss" scoped>
h3 {
  @apply mb-2;
}
</style>