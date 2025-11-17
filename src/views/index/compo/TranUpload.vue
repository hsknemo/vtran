<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { setFileToUserList, upChunkFile, mergeFile } from '@/api/file/file.ts'
import { ElMessage } from 'element-plus'
import { onLineUserList } from '@/views/index/store/store.ts'
import { useLocalStorage } from '@vueuse/core'
import { delay } from '@/utils/sleep.ts'

interface Data {
  fileList: File[]
}
interface ChunkDefine {
  index: number;
  chunk: Blob;
  fileName: string;
  size: number;
  chunkSize: number;
  fileTotalLen: number;
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
const uploading = ref(false)

const fileChunkCut = async (file:File, resolve) => {
  // 文件大小
  let fileLen = file.size
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
  let md5Key = crypto.randomUUID()
  const user = JSON.parse(useLocalStorage('user', '{}').value)
  for (let i = 0; i < chunkArr.length; i++) {
    let item = chunkArr[i]
    const formData:FormData = new FormData()
    formData.append('index', item.index)
    formData.append('chunk', item.chunk)
    formData.append('fileName', item.fileName)
    formData.append('chunkSize', item.size)
    formData.append('fileTotalLen', item.fileTotalLen)
    formData.append('toUserId', onLineUserList.curSelectUser)
    formData.append('fromUserId', user.id)
    formData.append('md5Key', md5Key)
    formData.append('chunkSliceNum', chunkArr.length)
    try {
      const res = await upChunkFile(formData)
      if (res.data.isUploaded) {
        ElMessage.success(`${file.name} 上传成功`)
        await delay(500)
        mergeFile({
          md5Key,
          toUserId: onLineUserList.curSelectUser,
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
  lockUpdateFile.value = true
  const formData:FormData = new FormData()
  if (!fileList.value.length) {
    return ElMessage.error('请选择文件！')
  }
  if (!onLineUserList.curSelectUser) {
    return ElMessage.error('请选择发送给的用户！')
  }
  let arr = []
  let promiseMap = []
  fileList.value.forEach(file => {
    // formData.append('name', file.name)
    // formData.append('file', file.raw)
    let promise= new Promise(resolve => {
      fileChunkCut(file, resolve)
    })
    promiseMap.push(promise)
  })
  Promise.all(promiseMap).then((boolenList) => {
    lockUpdateFile.value = false
    if (!boolenList.every(item => item)) {
      return ElMessage.error('发送失败')
    }
    ElMessage.success('发送成功')
  })
  // formData.append('toUserId', onLineUserList.curSelectUser)
  // formData.append('fromUserId', JSON.parse(useLocalStorage('user').value).id)



  // try {
  //   uploading.value = true
  //   await setFileToUserList(formData)
  //   ElMessage.success('发送成功')
  // } catch (e) {
  //   ElMessage.error(e)
  // } finally {
  //   uploading.value = false
  // }

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
        大文件未测试
      </div>
    </template>
  </el-upload>
  <el-button @click="sendFile">发送</el-button>
</template>

<style scoped>

</style>
