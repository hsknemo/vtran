<script setup lang="ts">
import { defineEmits, reactive } from 'vue'
import { addUser } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'
import { loginOrRegisAction } from '@/utils/LoginAndRegis.ts'
// 第6行修改为：
const emit = defineEmits(['close-login-page', 'has-login'])

const userData = reactive({
  username: '',
})

const onAddUser = async () => {
  try {
    if (!userData.username) {
      throw new Error('请填写用户名')
    }
    const res = await addUser(userData)
    emit('close-login-page')
    loginOrRegisAction(res.data.token, res.data.data)
    ElMessage.success(res.msg)
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const onLoginPage = () => {
  emit('has-login', userData)
}
</script>

<template>
  <div class="tran_add_user">
    <div class="tran_item">
      <div class="tran_item_title">用户名</div>
      <el-input placeholder="请输入用户名" v-model="userData.username"></el-input>
    </div>
    <div class="tran_item">
      <el-button @click="onAddUser">创建用户</el-button>
      <el-button @click="onLoginPage">已有账户？</el-button>
    </div>
  </div>
</template>

<style scoped></style>
