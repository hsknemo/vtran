<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import MonacoEditor from '@/views/index/pageComponent/MonacoEditor.vue'
import { saveNote } from '@/api/note/note.ts'
const ruleFormRef = ref<FormInstance>()
const monoEditorRef = ref()
const ruleForm = reactive({
  name: '',
  content: '',
  desc: '',
  markColor: 'gold',
})

const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]


const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入标签名称🏷'))
  } else {
    if (ruleForm.name !== '') {
      return true
    }
  }
}

const validateContent = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入内容🏷'))
  } else {
    if (ruleForm.content !== '') {
      return true
    }
  }
}

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
  content: [{ required: true, validator: validateContent}],
})

const onCreateNoteFetch = async (formEl: FormInstance | undefined) => {
  ruleForm.content = monoEditorRef.value.getValue()
  if (!formEl) return
  formEl.validate(valide => {
    if (valide) {
      console.log(ruleForm)
      saveNodeFetch()
    }
  })
}

const saveNodeFetch = async () => {
  try {
    await saveNote(ruleForm)
    ElMessage.success('保存成功')
  } catch (e) {
    debugger
    ElMessage.error('保存失败')
  }
}



</script>

<template>
<div class="create_panel">
  <el-form
    ref="ruleFormRef"
    style="width: 100%"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
  >
    <el-form-item label="便签名称" prop="name">
      <el-input v-model="ruleForm.name"
                clearable
                show-word-limit maxlength="30"/>
    </el-form-item>

    <el-form-item label="便签简述" prop="desc">
      <el-input v-model="ruleForm.desc"
                type="textarea"
                clearable
                show-word-limit maxlength="50"/>
    </el-form-item>

    <el-form-item label="便签标记颜色" prop="desc">
      <div class="color_div">
        <el-color-picker-panel
          v-model="ruleForm.markColor"
          show-alpha
          :predefine="predefineColors"
        />
        <section class="colro_model"
                 :style="{
                    '--raduis-color': ruleForm.markColor
                 }"
        >
          model 演示
        </section>
      </div>

    </el-form-item>

    <el-form-item label="便签内容" prop="content">
      <el-tag type="primary">支持markdown 语法</el-tag>
      <div class="tran_mono_editor">
        <monaco-editor
          ref="monoEditorRef"
          :isNeedDefaultLang="false"
        ></monaco-editor>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button text type="primary" @click="onCreateNoteFetch(ruleFormRef)">创建便签</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style scoped lang="scss">

@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.create_panel {
  max-width: 800px;

  .tran_mono_editor {
    width: 100%;
    height: 500px;
    margin-top: 10px;
  }
  .color_div {
    width: 100%;
    @include flexStyle( center, space-around);
    .colro_model {
      position: relative;
      @include flexStyle(center, center);
      color: #696d69;
      width: 200px;
      height: 200px;
      background-color: #1d1d1d;
      border-radius: 5px;
      &:after {
        content: '';
        position: absolute;
        right: 10px;
        top: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--raduis-color);
      }

    }
  }

}
</style>
