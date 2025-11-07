<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
import 'monaco-editor/min/vs/editor/editor.main.css'
import { watch } from 'vue'
const props = defineProps({
  value: String,
  language: String,
})

const emit = defineEmits(['update:value'])

watch({
  [props.language]: {
    handler(val) {
      monacoEditor.setValue(props.value)
      monacoEditor.setLanguage(val)
    },
  },
})
let monacoEditor = null
const { proxy } = getCurrentInstance()
onMounted(() => {
  setTimeout(() => {
    monacoEditor = monaco.editor.create(proxy.$refs.editContainer, {
      value: props.value,
      readOnly: false,
      language: props.language,
      theme: 'vs-dark',
      colorDecorators: true, // 颜色装饰器
      selectOnLineNumbers: true,
      renderSideBySide: false,
      tabSize: 2,
      fontSize: 16
    })

    // 监听值变化
    monacoEditor.onDidChangeModelContent(() => {
      const currenValue = monacoEditor?.getValue();

      emit('update:value', currenValue);
    });
  }, 1000)
})
</script>

<template>
  <div ref="editContainer" class="code-editor"></div>
</template>

<style scoped lang="scss">
.code-editor {
  width: 100%;
  min-height: 400px;
}
</style>
