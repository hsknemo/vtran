<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile, UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { upChunkFile, mergeFile } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'
import { onLineUserList } from '@/views/index/store/store.ts'
import { useLocalStorage } from '@vueuse/core'
import { delay } from '@/utils/sleep.ts'
import type { ChunkDefine, isUploaded } from '@/type/upload'
import { v4 as uuidv4 } from 'uuid';
import { UploadFilled } from '@element-plus/icons-vue'

const fileList = ref<UploadFile[]>([])

const onHttpRequest = (option:UploadRequestOptions) => {
  if (option.file) {
    // data.fileList.push(option.file)
  }
}
const uploading = ref(false)

const fileChunkCut = async (file: UploadFile, resolve: (value: boolean) => void) => {
  // 确保 file.raw 存在且为 File 类型
  if (!file || !file.raw || !file.size) {
    ElMessage.error('无效的文件')
    return resolve(false)
  }
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
    if (!item) continue;
    const formData:FormData = new FormData()
    formData.append('index', String(item.index));
    formData.append('chunk', item.chunk)
    formData.append('fileName', item.fileName)
    formData.append('chunkSize', String(item.size));
    formData.append('fileTotalLen', String(item.fileTotalLen))
    formData.append('toUserId', onLineUserList.curSelectUser)
    formData.append('fromUserId', user.id)
    formData.append('md5Key', md5Key)
    formData.append('chunkSliceNum', String(chunkArr.length))
    try {
      const res = await upChunkFile(formData) as { data: isUploaded }
      if (res.data.isUploaded) {
        ElMessage.success(`${file.name} 上传成功`)
        await delay(500)
        console.log('md5Key', md5Key)
        await mergeFile({
          md5Key,
          toUserId: onLineUserList.curSelectUser,
          fromUserId: user.id,
        })
        resolve(true)
      }
    } catch (e) {
      console.log('上传失败', e)
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
  if (!onLineUserList.curSelectUser) {
    return ElMessage.error('请选择发送给的用户！')
  }
  lockUpdateFile.value = true
  const promiseMap: Promise<boolean>[] = []
  fileList.value.forEach(file => {
    const promise = new Promise<boolean>((resolve) => {
      fileChunkCut(file, resolve)
    })
    promiseMap.push(promise)
  })
  Promise.all(promiseMap).then((booleanList) => {
    lockUpdateFile.value = false
    if (!booleanList.every(item => item)) {
      return ElMessage.error('发送失败')
    }
    ElMessage.success('发送成功')
  })
}

</script>

<template>
  <el-upload
    :disabled="lockUpdateFile"
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
        支持大文件上传
      </div>
    </template>
  </el-upload>
  <el-button @click="sendFile">发送</el-button>
</template>

<style scoped>

</style>
