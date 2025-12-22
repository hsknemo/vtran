<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark-reasonable.css'

defineProps<{
  htmlContent: string
}>()
</script>

<template>
  <div class="cotent_area markdown-body" v-html="htmlContent"></div>
</template>

<style scoped lang="scss">
@use '@/assets/markdown-mine.scss';
</style>
