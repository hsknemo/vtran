<script setup lang="ts">

import { changeFileName, onDownload } from '@/views/index/service/utils/tableUtils.ts'

defineProps({
  tableData: {
    type: Array,
    default: () => ([])
  }
})

</script>

<template>
  <el-table
    height="400px"
    :data="tableData" style="width: 100%">
    <el-table-column type="index" label="序号" width="80" />
    <el-table-column prop="fileName" label="文件名称" width="400" >
      <template #default="scope">
        <div>{{ changeFileName(scope.row.fileName) }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="insertTime" label="发送时间" width="220" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button @click="onDownload(scope.row)" link type="primary" size="small">下载</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>
