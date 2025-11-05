<script setup lang="ts">
import { getMineFileList } from '@/api/file/file.ts'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'
const tableLoading = ref(false)

let tableData:never[] = []
const get_file_list = async () => {
  try {
    tableLoading.value = true
    const res = await getMineFileList()
    tableData = res.data
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

onMounted(_ => {
  get_file_list()
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
    <el-table-column prop="toUserName" label="接收者" width="120" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button @click="onDownload(scope.row)" link type="primary" size="small">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>
