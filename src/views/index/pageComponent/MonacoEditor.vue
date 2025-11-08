<script setup lang="ts">
import MonacoEditor from 'monaco-editor-vue3';
const str = ref(`// please input code \n `)
const language = ref('javascript')
let outPutStr = ''

const getValue = () => {
  outPutStr = ''
  outPutStr = str.value

  // 拼接markdown格式
  const lang = language.value
  const startMarkdonw = '```' + lang + '\n'
  outPutStr = startMarkdonw + outPutStr
  outPutStr += '\n' + '```'

  return outPutStr
}

defineExpose({
  getValue,
  setLanguage(lang: string) {
    debugger
    language.value = lang
  }
})

</script>

<template>
  <MonacoEditor
    v-model:value="str"
    :language="language"
    theme="vs-dark"
  />
</template>

<style scoped lang="scss">
.code-editor {
  width: 100%;
  min-height: 400px;
}
</style>
