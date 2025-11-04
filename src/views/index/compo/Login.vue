<script setup lang="ts">
import { reactive, defineEmits } from 'vue'
import { loginUser } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'
import { loginOrRegisAction } from '@/utils/LoginAndRegis.ts'
import { emitter } from '@/event/eventBus.ts'
import { face_smile_to_life } from '@/utils/happyiness.ts'
const emit = defineEmits(['close-login-page', 'show-create-page'])

// 显式定义组件名（解决ESLint警告）
defineOptions({
  name: 'UserLogin'
})

const userData = reactive({
  username: '',
})

const onLogin = async () => {
  try {
    if (!userData.username) {
      throw new Error('请填写用户名')
    }
    const res = await loginUser(userData)
    emit('close-login-page')
    loginOrRegisAction(res.data.token, res.data.data)
    ElMessage.success(res.msg)
    face_smile_to_life()
    emitter.emit('refresh-user')
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const onCreatePage = () => {
  emit('show-create-page')
}
</script>

<template>
<div class="tran_login">
  <div class="tran_item">
    用户名：<el-input placeholder="请输入用户名" v-model="userData.username"></el-input>
  </div>
  <div class="tran_item">
    <el-button @click="onLogin">登录</el-button>
    <el-button @click="onCreatePage">没有账户？</el-button>
  </div>
</div>
</template>

<style scoped>

</style>
