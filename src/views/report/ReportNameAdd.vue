<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useDictList, useSaveDict } from '@/service/dict/dictService.ts'
import moment from 'moment'
const popControl = ref({
  show: false,
})
const rules = {
  groupName: [{ required: true, message: '分组名称必填', trigger: 'blur' }],
  name: [{ required: true, message: '字典名称必填', trigger: 'blur' }],
  code: [{ required: true, message: '字典编码必填', trigger: 'blur' }],
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<DictServiceNamespace.dictForm>({
  name: '',
  code: '',
  groupName: '',
})
const save = async () => {
  if (!ruleFormRef.value) return
  const bool = await ruleFormRef.value.validate()
  if (bool) {
    await useSaveDict(ruleForm.value)
  }
}
const tableData = ref([])
const total = ref(0)
const query = ref<DictServiceNamespace.filterProp>({
  name: '',
  page: 1,
  pageSize: 20,
  groupName: '',
})

const getPage = async () => {
  let res = await useDictList(query.value)
  res.list.forEach((item) => {
    item.insertTime = moment(item.insertTime).format('YYYY-MM-DD HH:mm:ss')
  })
  total.value = res.total
  tableData.value = res.list
}

const handleCurrentChange = (val: number) => {
  query.value.page = val
  getPage()
}

onMounted(() => {
  getPage()
})
</script>

<template>
  <div>
    <el-dialog
      draggable
      overflow
      class="tran_editor"
      v-model="popControl.show"
      title="字典管理"
      :close-on-click-modal="false"
      width="800"
    >
      <div>
        <el-form
          ref="ruleFormRef"
          style="width: 50%"
          :model="ruleForm"
          status-icon
          :rules="rules"
          size="small"
          label-suffix=":"
        >
          <el-form-item label="分组名称" prop="groupName">
            <el-input v-model="ruleForm.groupName" placeholder="请输入分组名称" />
          </el-form-item>
          <el-form-item label="新增项目" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入项目" />
          </el-form-item>

          <el-form-item label="新增编码" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入编码" />
          </el-form-item>
        </el-form>
        <el-button size="small" @click="save">保存</el-button>
      </div>
    </el-dialog>

    <div>
      <header>
        <el-row gutter="24">
          <el-col :span="6">
            <el-input v-model="query.name" size="small" placeholder="请输入编码名称"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="query.groupName"
              size="small"
              placeholder="请输入分组名称"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-button size="small" @click="getPage">查询</el-button>
            <el-button @click="popControl.show = true" size="small">添加字典</el-button>
          </el-col>
        </el-row>
      </header>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="编码名称" prop="name"></el-table-column>
        <el-table-column label="码值" prop="code"></el-table-column>
        <el-table-column label="分组名称" prop="groupName"></el-table-column>
        <el-table-column label="创建时间" prop="insertTime"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-size="query.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
