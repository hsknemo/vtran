<script setup lang="ts">
import { onMounted } from 'vue'
import { clipBord } from '@/utils/clipBord.ts'
import mdShiki from '@/utils/mdShiki.ts'

const mdValue = ref('')

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
  mdValue.value = mdShiki.render(props.value)
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

onMounted(() => {
  getMdValue()
})
</script>

<template>
  <div
    class="tran_markdown_show_area markdown-body"
    @click="($event) => onMarkeDownClick($event)"
    v-html="mdValue"
    v-copy="mdValue"
  ></div>
</template>

<style lang="scss">
@use '@/assets/markdown-mine.scss';
</style>
