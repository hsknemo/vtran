<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { UploadFile } from 'element-plus'
import type { ChunkDefine } from '@/type/upload'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from '@vueuse/core'
import { delay } from '@/utils/sleep.ts'
import { appRecordAdd, uploadSoftware } from '@/api/softwareStore/software.ts'
import { categoryReactive } from '@/hook/category.ts'
const emit = defineEmits(['upload-success'])
const fileList = ref<UploadFile[]>([])
const lockUpdateFile = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
  cate: '',
  desc: '',
  appIsUpload: '',
})

const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('appName 必填'))
  } else {
    if (ruleForm.name !== '') {
      return true
    }
  }
}
const validateCate = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('分类 必选'))
  } else {
    if (ruleForm.cate !== '') {
      return true
    }
  }
}

const validateAppIsUpload = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('未选择需要上架的app'))
  } else {
    if (ruleForm.appIsUpload !== '') {
      return true
    }
  }
}

const onHttpRequest = () => {}

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
  cate: [{ required: true, validator: validateCate, trigger: 'blur' }],
  appIsUpload: [{ required: true, validator: validateAppIsUpload, trigger: 'change' }],
})

const fileChunkCut = async (file: File, resolve) => {
  // 文件大小
  const fileLen = file.size
  const chunkSize = 1024 * 1024 * 10
  const chunkArr: Array<ChunkDefine> = []
  const chunkCount = Math.ceil(fileLen / chunkSize)
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize
    const end = Math.min(fileLen, start + chunkSize)
    const chunk = file.raw.slice(start, end)
    chunkArr.push({
      index: i,
      chunk,
      chunkSize,
      fileName: file.name,
      size: chunk.size,
      fileTotalLen: fileLen,
    })
  }
  const md5Key = uuidv4()
  const user = JSON.parse(useLocalStorage('user', '{}').value)
  for (let i = 0; i < chunkArr.length; i++) {
    const item = chunkArr[i]
    const formData: FormData = new FormData()
    formData.append('index', item.index)
    formData.append('chunk', item.chunk)
    formData.append('fileName', item.fileName)
    formData.append('chunkSize', item.size)
    formData.append('fileTotalLen', item.fileTotalLen)
    formData.append('toUserId', user.id)
    formData.append('fromUserId', user.id)
    formData.append('md5Key', md5Key)
    formData.append('chunkSliceNum', chunkArr.length)
    try {
      const res = await uploadSoftware(formData)
      if (res.data.isUploaded) {
        ElMessage.success(`${file.name} 上传成功`)
        await delay(500)
        await appRecordAdd({
          md5Key,
          toUserId: user.id,
          fromUserId: user.id,
          appName: ruleForm.name,
          appSize: file.size,
          appDesc: ruleForm.desc,
          appCategory: ruleForm.cate,
        })
        resolve(true)
      }
    } catch (e) {
      console.log(e)
      ElMessage.error('上传失败')
      resolve(false)
      break
    }
  }
}

const onAppUpload = async () => {
  // 每次点击上传 重置form upload 记录
  ruleForm.appIsUpload = ''
  if (fileList.value.length) {
    ruleForm.appIsUpload = true
  }
  try {
    ruleFormRef.value.validate((valide) => {
      if (valide) {
        if (!fileList.value) {
          return ElMessage.error('请选择需要上传的app')
        }
        const promise = new Promise((resolve) => {
          fileChunkCut(fileList.value[0], resolve)
        })
        Promise.all([promise]).then(boolenList => {
          if (!boolenList.every(item => item)) {
            return ElMessage.error('记录添加失败')
          }

          emit('upload-success', true)
        })
      }
    })
  } catch (e) {
    ElMessage.error('上传失败:' + e)
  }
}
</script>

<template>
  <div class="up_app_form">
    <el-form
      ref="ruleFormRef"
      style="width: 100%"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="app分类" prop="cate">
        <el-select v-model="ruleForm.cate">
          <el-option
            v-for="(item, index) in categoryReactive.categoryList"
            :key="index"
            :label="item.categoryName"
            :value="item.categoryName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="app名称" prop="name">
        <el-input v-model="ruleForm.name" clearable show-word-limit maxlength="10" />
      </el-form-item>

      <el-form-item label="app描述" prop="desc">
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          resize="none"
          :rows="5"
          clearable
          show-word-limit
          maxlength="100"
        />
      </el-form-item>

      <el-form-item label="app文件" prop="appIsUpload">
        <el-upload
          w-full
          :disabled="lockUpdateFile"
          class="upload-demo"
          drag
          v-model:file-list="fileList"
          :http-request="onHttpRequest"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽 或者 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">支持大文件上传</div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <section w-full text-right>
          <el-button size="small" @click="onAppUpload">上传</el-button>
        </section>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
