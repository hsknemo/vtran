<script setup lang="ts">
import MonacoEditor from '@/views/index/pageComponent/MonacoEditor.vue'
const emit = defineEmits(['form-sure'])
const props = defineProps({
  popControl: {
    type: Object,
    default: () => ({
      show: false,
    }),
  },
})

const str = ref(`// please input code \n `)
let outPutStr = ''
const selectLanguage = ref('javascript')
const languageList = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'rust',
  'html',
  'css',
  'json',
  'markdown',
]

const onEmitSure = () => {
  props.popControl.show = false
  outPutStr = str.value

  // 拼接markdown格式
  const language = selectLanguage.value
  const startMarkdonw = "```" + language + "\n"
  outPutStr = startMarkdonw + outPutStr
  outPutStr += "\n" + "```"

  console.log(outPutStr )
  emit('form-sure', outPutStr)
  outPutStr = ''
}
</script>

<template>
  <el-dialog
    class="tran_editor"
    v-model="popControl.show" title="编辑器"
             :close-on-click-modal="false" width="800">
    <div class="tran_edit_top_select">
      <div class="edit_block_item">
        <div class="edit_block_item_title">语言</div>
        <el-select v-model="selectLanguage">
          <template v-for="item in languageList" :key="item">
            <el-option :label="item" :value="item"> </el-option>
          </template>
        </el-select>
      </div>
    </div>

    <MonacoEditor v-model:value="str" :language="popControl.language" />

    <div class="tran_edit_bottom_btn">
      <el-button @click="popControl.show = false">取消</el-button>
      <el-button type="primary" @click="onEmitSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
@mixin tran_edit_bottom_btn {
  .tran_edit_bottom_btn {
    margin-top: 10px;
    text-align: right;
  }
}
@mixin edit_block_item {
  .edit_block_item {
    width: 20%;
    @include flexStyle(center);
    margin-bottom: 10px;


    .edit_block_item_title {
      white-space: nowrap;
    }
  }
}
.tran_edit_top_select {
  @include edit_block_item;

}

.tran_editor {

  @include tran_edit_bottom_btn();
}
</style>
