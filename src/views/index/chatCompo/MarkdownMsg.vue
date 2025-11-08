<script setup lang="ts">
import { computed } from 'vue'
import markdownIt from 'markdown-it'
import { ElMessage } from 'element-plus'
import { clipBord } from '@/utils/clipBord.ts'
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

const onMarkeDownClick = function() {
  let event = arguments[0]
  let ev = event
  // 增加点击复制
  if (event.target.classList.contains('cp_btn_svg')) {
    ev.stopPropagation()
    ev.preventDefault()
    let item = ev.target
    let codeNum = item.dataset.code
    let parentEle = item.closest('pre')
    let code = parentEle.querySelector(`code[js-code-block="${codeNum}"]`)


    clipBord(code.textContent)
  }
}

</script>

<template>
  <div class="tran_markdown_show_area"
       @click="$event => onMarkeDownClick($event)"
       v-html="mdValue"
       v-highlight="mdValue"
  >
  </div>
</template>

<style  lang="scss">
@use '@/assets/markdown-mine.scss'
</style>
