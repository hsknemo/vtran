<script setup lang="ts">
import { useExportList, useReportList } from '@/service/report/reportService.ts'
import moment from 'moment'
import { onMounted, getCurrentInstance } from 'vue'
const $downloadBlob = inject('$downloadBlob')
const tableLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const workDict = ref(inject('workDict', []))
const form = ref<reportServiceNamespace.filterProp>({
  reportName: '',
  reportDesc: '',
  page: 1,
  pageSize: 10,
})

const getPage = async () => {
  tableLoading.value = true
  const res = await useReportList(form.value)
  res.list.forEach((item) => {
    item.insertTime = moment(item.insertTime).format('YYYY-MM-DD HH:mm:ss')
  })
  tableData.value = res.list
  tableLoading.value = false
  total.value = res.total
}

const handleCurrentChange = (val: number) => {
  form.value.page = val
  getPage()
}

const getReportNameByDict = (reportName: string) => {
  console.log(reportName, 'reportName', workDict.value)
  if (!workDict.value.length) return ''
  return workDict.value.find((item: DictServiceNamespace.dictForm) => item.code === reportName).name
}

const handelExport = async () => {
  const prop = Object.assign({}, form.value)
  delete prop.page
  const blobData = await useExportList(prop)
  $downloadBlob(blobData, '日报.xlsx')
}

onMounted(() => {
  getPage()
})
</script>

<template>
  <div>
    <section>
      <el-row gutter="24">
        <el-col :span="4">
          <el-input v-model="form.reportName" placeholder="请输入标题"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            type="textarea"
            :rows="1"
            v-model="form.reportDesc"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="form.range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button size="small" @click="getPage">查询</el-button>
          <el-button size="small" @click="handelExport">导出</el-button>
        </el-col>
      </el-row>
    </section>
    <el-table height="400px" v-loading="tableLoading" :data="tableData" style="width: 100%">
      >
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="reportName" label="日报标题">
        <template #default="scope">
          {{ getReportNameByDict(scope.row.reportName) }}
        </template>
      </el-table-column>
      <el-table-column prop="reportDesc" label="日报内容"> </el-table-column>
      <el-table-column prop="title" label="归属日期"> </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="form.page"
      :page-size="form.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<style scoped lang="scss"></style>
