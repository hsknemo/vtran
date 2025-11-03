<script setup lang="ts">
import { deleteFile, getFileList } from '@/api/file/file.ts'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
const tableLoading = ref(false)

let tableData:never[] = []
const get_file_list = async () => {
  try {
    tableLoading.value = true
    const res = await getFileList()
    tableData = res.data
    emitter.emit('refresh-bell-length', tableData.length)
  } catch (e) {
    ElMessage.error('文件列表获取失败：', e.message)
  } finally {
    tableLoading.value = false
  }
}

const onDownload = (row:DefaultRow) => {
  const aElement:HTMLAnchorElement = document.createElement('a')
  aElement.href = import.meta.env.VITE_API_URL + '/' + row.toUser + '/' + row.fileName
  aElement.download = row.fileName
  aElement.target = '_blank'
  aElement.click()
  aElement.remove()
}

const onDeleteFile = async (row:DefaultRow) => {
  try {
    await deleteFile({
      fileId: row.id
    })
    get_file_list()
    ElMessage.success('已删除文件')
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

onMounted(_ => {
  get_file_list()
  emitter.on('refresh-file', get_file_list)
})

defineExpose({
  get_file_list
})

</script>

<template >
  <el-table
    height="400px"
    v-loading="tableLoading" :data="tableData" style="width: 100%">
    <el-table-column type="index" label="序号" width="80" />
    <el-table-column prop="fileName" label="文件名称" width="400" />
    <el-table-column prop="insertTime" label="发送时间" width="220" />
    <el-table-column prop="fromUserName" label="发送人" width="120" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button @click="onDownload(scope.row)" link type="primary" size="small">下载</el-button>
        <el-button @click="onDeleteFile(scope.row)" link type="danger" size="small">删除文件</el-button>

      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>
