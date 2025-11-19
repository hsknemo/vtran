<script setup lang="ts">
import { defineEmits, reactive } from 'vue'
import { addUser } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'
import { loginOrRegisAction } from '@/utils/LoginAndRegis.ts'
import { useRouter } from 'vue-router'
const router = useRouter()
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
    router.push('/')
  } catch (e) {
    ElMessage.error('注册失败' + e)
  }
}

const onLoginPage = () => {
  router.push('/login')
}
</script>

<template>
  <div class="tran_add_user">
    <div class="b_txt">Regis</div>
    <div class="tran_item">
      <div class="tran_item_title">用户名</div>
      <el-input @keydown.enter="onAddUser" placeholder="请输入用户名" v-model="userData.username"></el-input>
    </div>
    <div class="tran_item">
      <el-button @click="onAddUser">创建用户</el-button>
      <el-button @click="onLoginPage">已有账户？</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/login";
</style>

