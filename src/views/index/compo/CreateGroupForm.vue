<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { onLineUserList } from '@/views/index/store/store.ts'
import { createGroup } from '@/api/group/group.ts'
import { useLocalStorage } from '@vueuse/core'
const emit = defineEmits(['form-reback', 'group-created'])
const selectUserList = ref(new Set())
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: '',
})
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入群名称'))
  } else {
    if (ruleForm.name !== '') {
      return true
    }
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
  name: [{ required: true, validator: validateName, trigger: 'blur' }],
})

const reback = () => {
  emit('form-reback')
}

// 选人
const onSelectUser = row => {
  if (selectUserList.value.has(row.id)) {
    selectUserList.value.delete(row.id)
  } else {
    selectUserList.value.add(row.id)
  }
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  selectUserList.value.clear()
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(valide => {
    if (valide) {
      createGroupFetch()
    }
  })
}

/**
 * 创建群聊
 */
const createGroupFetch = async () => {
  try {
    const data = await createGroup({
      createUserId: JSON.parse(useLocalStorage('user').value).id,
      name: ruleForm.name,
      userList: [...Array.from(selectUserList.value)],
    })
    emit('group-created', data.data)
    ElMessage.success('创建群聊成功')
  } catch (e) {
    ElMessage.error('创建群聊失败')
  }
}



</script>

<template>
  <el-form
    ref="ruleFormRef"
    style="width: 100%"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="createGroupForm"
  >

    <el-form-item label="群名称" prop="name">
      <el-input v-model="ruleForm.name" show-word-limit maxlength="30"/>
    </el-form-item>
    <el-form-item label="选择成员">
      <section class="user_list_panel">
        <div class="user_info_item"
             :class="[
                selectUserList.has(item.id) ? 'active': '',
             ]"
             @click="onSelectUser(item)"
             v-for="(item, index) in onLineUserList.onlineList"
             :key="index"
        >
          <div class="user_info">
           {{ item.username }}
          </div>
        </div>
      </section>
    </el-form-item>
    <el-form-item>
      <div class="block_control">
        <el-button type="primary" @click="() => submitForm(ruleFormRef)">
          确认
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        <el-button @click="reback">返回</el-button>
      </div>

    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.createGroupForm {
  .user_list_panel {
    @include flexStyle();
    flex-wrap: wrap;
    max-height: 200px;
    overflow: auto;

    .user_info_item {
      cursor: pointer;
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 5px;
      background-color: #1d1d1d;
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid transparent;
      transition: border .3s linear;
      &.active,
      &:hover {
        border: 1px solid #74f574;
      }
      &:last-child {
        margin-right: unset;
      }
    }
  }

  .block_control {
    width: 100%;
    text-align: right;
  }
}
</style>
