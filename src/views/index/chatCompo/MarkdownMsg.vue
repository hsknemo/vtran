<script setup lang="ts">
import { computed } from 'vue'
import markdownIt from 'markdown-it'
const mdIt = new markdownIt()
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const mdValue = computed({
  get() {
    return mdIt.render(props.value)
  }
})

</script>

<template>
  <div class="tran_markdown_show_area"
       v-html="mdValue"
       v-highlight="mdValue"
  >
  </div>
</template>

<style  lang="scss">
@use '@/assets/markdown-mine.scss'
</style>
