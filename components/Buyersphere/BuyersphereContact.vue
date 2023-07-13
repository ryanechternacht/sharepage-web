<template>
  <div class="flex flex-col items-center">
    <h3>What's on your mind?</h3>
    <Editor
      api-key="2htrrda1ywukt91mvkpsd7m0j884up00dz8u5jrllk8cf325"
      class="bg-gray-light w-3/4"
      :init="{
        plugins: '',
        menubar: false,
      }"
      :inline="true"
      model-events="change keydown blur focus paste"
      :modelValue="question"
      style="min-height: 40px"
      @update:modelValue="newValue => $emit('update:text', newValue)"
    />
    <button class="bg-purple-dark w-[6rem] h-[2.5rem] rounded-md">
      <div class="w-full h-full flex flex-row items-center justify-center text-white">
        Send
      </div>
    </button>
  </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({ partner: String })

const question = ref('')
</script>