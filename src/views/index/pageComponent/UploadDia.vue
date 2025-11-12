<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { ElMessage } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'
import { setFileToUserList } from '@/api/file/file.ts'
import { chatMsgList } from '@/views/index/store/chat.ts'
const emit = defineEmits(['upload-msg'])
const props = defineProps({
    popControl: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    }
})
const onHttpRequest = (option:UploadRequestOptions) => {
  if (option.file) {
    // data.fileList.push(option.file)
  }
}
const uploading = ref(false)

interface Data {
  fileList: File[]
}
const fileList = ref([])
const data:Data = reactive({
  fileList: [],
})


const sendFile = async () => {
  const formData:FormData = new FormData()
  if (!fileList.value.length) {
    return ElMessage.error('请选择文件！')
  }
  if (!chatMsgList.currentUser.id) {
    return ElMessage.error('请选择发送给的用户！')
  }

  fileList.value.forEach(file => {
    formData.append('name', file.name)
    formData.append('file', file.raw)
  })
  formData.append('toUserId', chatMsgList.currentUser.id)
  formData.append('fromUserId', JSON.parse(useLocalStorage('user', '{}').value).id)
  try {
    uploading.value = true
    await setFileToUserList(formData)
    ElMessage.success('发送成功')
    emit('upload-msg', true)
  } catch (e) {
    ElMessage.error(e)
  } finally {
    uploading.value = false
  }

}

</script>

<template>
  <el-dialog
    draggable
    overflow
    class="tran_editor"
    v-model="popControl.show"
    title="上传文件"
    :close-on-click-modal="false"
    width="800"
  >
    <el-upload
      v-loading="uploading"
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

  </el-dialog>
</template>

<style scoped lang="scss">

</style>
