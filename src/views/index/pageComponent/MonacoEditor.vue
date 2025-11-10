<script setup lang="ts">
import MonacoEditor from 'monaco-editor-vue3';
import { computed } from 'vue'
const str = ref(`// please input code \n `)
const language = ref('javascript')
let outPutStr = ''

const props = defineProps({
  // 是否需要默认语言
  isNeedDefaultLang: {
    type: Boolean,
    default: true
  },
  value: String,
})

const v = computed( {
  get() {
    if (props.value) {
      return props.value
    }
    return str.value
  },
  set(v) {
    str.value = v
  }
})

const getValue = () => {
  outPutStr = ''
  outPutStr = str.value

  if (props.isNeedDefaultLang) {
    // 拼接markdown格式
    const lang = language.value
    const startMarkdonw = '```' + lang + '\n'
    outPutStr = startMarkdonw + outPutStr
    outPutStr += '\n' + '```'
  }

  return outPutStr
}

defineExpose({
  getValue,
  setLanguage(lang: string) {
    language.value = lang
  }
})

</script>

<template>
  <MonacoEditor
    v-model:value="v"
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
