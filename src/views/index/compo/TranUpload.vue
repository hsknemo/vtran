<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { setFileToUserList } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'
import { onLineUserList } from '@/views/index/store/store.ts'
import { useLocalStorage } from '@vueuse/core'
interface Data {
  fileList: File[]
}
const fileList = ref([])
const data:Data = reactive({
  fileList: [],
})
const onHttpRequest = (option:UploadRequestOptions) => {
  if (option.file) {
    // data.fileList.push(option.file)
  }
}

const sendFile = async () => {
  const formData:FormData = new FormData()
  if (!fileList.value.length) {
    return ElMessage.error('请选择文件！')
  }
  if (!onLineUserList.curSelectUser) {
    return ElMessage.error('请选择发送给的用户！')
  }

  fileList.value.forEach(file => {
    formData.append('name', file.name)
    formData.append('file', file.raw)
  })
  formData.append('toUserId', onLineUserList.curSelectUser)
  formData.append('fromUserId', JSON.parse(useLocalStorage('user', '{}').value).id)
  try {
    const res = await setFileToUserList(formData)
    ElMessage.success(res.data.msg)
  } catch (e) {
    ElMessage.error(e.msg)
  }

}

</script>

<template>
  <el-upload
    class="upload-demo"
    drag
    v-model:file-list="fileList"
    multiple
    :http-request="onHttpRequest"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽 或者 <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        大文件未测试
      </div>
    </template>
  </el-upload>
  <el-button @click="sendFile">发送</el-button>
</template>

<style scoped>

</style>
