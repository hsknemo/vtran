<script setup lang="ts">
import { ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { ElMessage } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'
import { mergeFile, upChunkFile } from '@/api/file/file.ts'
import { chatMsgList } from '@/views/index/store/chat.ts'
import { delay } from '@/utils/sleep.ts'
import type { ChunkDefine } from '@/type/upload'
import { v4 as uuidv4 } from 'uuid'
import { UploadFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['upload-msg'])
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const fileList = ref<File[]>([])

const fileChunkCut = async (file:File, resolve) => {
  // 文件大小
  const fileLen = file.size
  const chunkSize = 1024 * 1024 * 10
  const chunkArr:Array<ChunkDefine> = []
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
    const formData:FormData = new FormData()
    formData.append('index', item.index)
    formData.append('chunk', item.chunk)
    formData.append('fileName', item.fileName)
    formData.append('chunkSize', item.size)
    formData.append('fileTotalLen', item.fileTotalLen)
    formData.append('toUserId', chatMsgList.currentUser.id)
    formData.append('fromUserId', user.id)
    formData.append('md5Key', md5Key)
    formData.append('chunkSliceNum', chunkArr.length)
    try {
      const res = await upChunkFile(formData)
      if (res.data.isUploaded) {
        ElMessage.success(`${file.name} 上传成功`)
        await delay(500)
        await mergeFile({
          md5Key,
          toUserId: chatMsgList.currentUser.id,
          fromUserId: user.id,
        })
        resolve(true)
      }
    } catch (e) {
      ElMessage.error('上传失败')
      resolve(false)
      break
    }
  }

}
const lockUpdateFile = ref(false)
const sendFile = async () => {
  if (lockUpdateFile.value) {
    return ElMessage.error('客官 ~ 文件正在传递，勿重复点击yo~~')
  }
  if (!fileList.value.length) {
    return ElMessage.error('请选择文件！')
  }
  if (!chatMsgList.currentUser.id) {
    return ElMessage.error('请选择发送给的用户！')
  }
  lockUpdateFile.value = true
  const promiseMap:Array<Promise<any>> = []
  fileList.value.forEach(file => {
    const promise= new Promise(resolve => {
      fileChunkCut(file, resolve)
    })
    promiseMap.push(promise)
  })
  Promise.all(promiseMap).then((boolenList) => {
    lockUpdateFile.value = false
    if (!boolenList.every(item => item)) {
      return ElMessage.error('发送失败')
    }
    emit('upload-msg', true)
    ElMessage.success('发送成功')
  })
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
