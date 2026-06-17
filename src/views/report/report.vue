<script setup lang="ts">
import WorkItemPage from '@/views/report/WorkItemPage.vue'
import WorkListPage from '@/views/report/WorkListPage.vue'
import ReportNameAdd from '@/views/report/ReportNameAdd.vue'
import { useDictList } from '@/service/dict/dictService.ts'
import { provide } from 'vue'

const activeTab = ref('workItem')

const workDict = ref([])
// 获取字典
const getWorkDict = async () => {
  const res = await useDictList({
    page: 1,
    pageSize: 1000,
    groupName: '日报项目',
  })
  workDict.value = res.list.map((it: DictServiceNamespace.dictForm) => {
    return {
      name: it.name,
      code: it.code,
    }
  })
}

provide('workDict', workDict)

onMounted(() => {
  getWorkDict()
})
</script>

<template>
  <div class="report">
    <div text-sm font-bold>日报</div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="工作项" name="workItem">
        <WorkItemPage />
      </el-tab-pane>

      <el-tab-pane label="工作项列表" name="workListPage">
        <WorkListPage />
      </el-tab-pane>

      <el-tab-pane label="字典配置" name="reportNameAdd">
        <ReportNameAdd />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss"></style>
