<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSaveReport } from '@/service/report/reportService.ts'
import MaterialSymbolsAdd from '~icons/material-symbols/add'
import MaterialSymbolsLightDeleteOutlineRounded from '~icons/material-symbols-light/delete-outline-rounded'
import { useDictList } from '@/service/dict/dictService.ts'

const ruleFormRef = ref()
const ruleForm = ref<reportServiceNamespace.FormProp>({
  workList: [],
})
const workList = ref<reportServiceNamespace.WorkList[]>([])
const rules = {}
const createWorkListItem = () => {
  workList.value.push({
    title: '',
  })
}

const createTimeListItem = (row: reportServiceNamespace.WorkList) => {
  row.timeList = row.timeList || []
  row.timeList.push({
    reportName: '',
    reportDesc: '',
  })
}

const workDict = ref(inject('workDict', []))

const deleteFormList = (index: number, timeList: reportServiceNamespace.TimeList[]) => {
  timeList.splice(index, 1)
}

const onSubmit = () => {
  ruleForm.value.workList = workList.value
  useSaveReport(ruleForm.value)
}
</script>

<template>
  <section >
    <section rounded  position="relative" flex items-center="" justify-center="">
      <el-form
        ref="ruleFormRef"
        style="width: 50%"
        :model="ruleForm"
        status-icon
        :rules="rules"
        size="small"
        label-suffix=":"
      >
        <el-form-item w-full="">
          <template #label>
            <div flex items-center="">
              工作项：
              <MaterialSymbolsAdd @click="createWorkListItem" cursor-pointer />
            </div>
          </template>

          <template v-for="(item, index) in workList" :key="index">
            <section mb-5 w-full="">
              <div v-if="item.title">{{ item.title }} 的工作项</div>
              <div flex gap-1 mb-2>
                <el-date-picker
                  v-model="item.title"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                  style="width: 100%"
                />
                <el-button size="small" @click="createTimeListItem(item)">添加日期项</el-button>
              </div>

              <template :key="idx" v-for="(it, idx) in item.timeList">
                <div flex w-full items-center flex-justify-between mb-2>
                  <section w-50%>
                    <el-select v-model="it.reportName" placeholder="请选择工作项名称">
                      <el-option
                        :key="index"
                        v-for="(item, index) in workDict"
                        :label="item.name"
                        :value="item.code"
                      ></el-option>
                    </el-select>
                  </section>
                  <el-button
                    text-red
                    mt-1
                    mb-1
                    size="small"
                    @click="deleteFormList(idx, item.timeList)"
                  >
                    <MaterialSymbolsLightDeleteOutlineRounded text-sm="" cursor-pointer />
                    <span>删除当前项</span>
                  </el-button>
                </div>

                <section w-full="">
                  <el-input
                    :rows="5"
                    v-model="it.reportDesc"
                    type="textarea"
                    placeholder="请输入工作项描述"
                  />
                </section>
              </template>
            </section>
          </template>
        </el-form-item>
      </el-form>
    </section>

    <section flex items-center="" justify-center="">
      <el-button size="small" @click="onSubmit">添加 </el-button>
    </section>
  </section>
</template>

<style scoped lang="scss"></style>
