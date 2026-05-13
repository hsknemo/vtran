<script setup lang="ts">
import { onMounted } from 'vue'
import { clipBord } from '@/utils/clipBord.ts'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.min.css' //样式

const mdValue = ref('')
const markdownIt = MarkdownIt({
  highlight: function (str: string) {
    return hljs.highlightAuto(str).value
  },
})

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

watch(
  () => props.value,
  () => {
    getMdValue()
  },
)

const getMdValue = async () => {
  mdValue.value = markdownIt.render(props.value)
}
const onMarkeDownClick = function () {
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

const checkMavonStyle = () => {
  // 这个库引入的插件跟当前文件的样式冲突 因此要清掉
  let codeStyle = document.querySelector('#md-code-style')
  codeStyle && codeStyle.remove()
}

onMounted(() => {
  getMdValue()

  checkMavonStyle()
})
</script>

<template>
  <div
    class="tran_markdown_show_area tran__markdown-body"
    @click="($event) => onMarkeDownClick($event)"
    v-html="mdValue"
    v-highlight="mdValue"
  ></div>
</template>

<style lang="scss">
@use '@/assets/markdown-mine.scss';
</style>
