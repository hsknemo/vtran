<script setup lang="ts">
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'

defineProps({
  tableData: {
    type: Array,
    default: () => ([])
  }
})

const onDownload = (row:DefaultRow) => {
  const aElement:HTMLAnchorElement = document.createElement('a')
  aElement.href = import.meta.env.VITE_API_URL + '/' + row.toUser + '/' + row.fileName
  aElement.download = row.fileName
  aElement.target = '_blank'
  aElement.click()
  aElement.remove()
}
</script>

<template>
  <el-table
    height="400px"
    :data="tableData" style="width: 100%">
    <el-table-column type="index" label="序号" width="80" />
    <el-table-column prop="fileName" label="文件名称" width="400" />
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
