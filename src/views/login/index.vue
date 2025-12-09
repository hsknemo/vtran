<script setup lang="ts">
import { defineEmits } from 'vue'
import { emitter } from '@/event/eventBus.ts'
const emit = defineEmits(['close-login-page', 'show-create-page'])
import { useRouter } from 'vue-router'
import { useLoginService, userData } from '@/service/login/loginService.ts'
const router = useRouter()

// 显式定义组件名（解决ESLint警告）
defineOptions({
  name: 'UserLogin'
})



const onLogin = async () => {
  const bool = await useLoginService()
  if (bool) {
    emit('close-login-page')
    emitter.emit('refresh-user')
    await router.push('/')
  }
}

const onCreatePage = () => {
  router.push('/regis')
}
</script>

<template>
  <div class="tran_login">
    <div class="b_txt">Login</div>
    <div class="tran_item">
      <div class="tran_item_title">用户名</div>
      <el-input @keydown.enter="onLogin" placeholder="请输入用户名" v-model="userData.username"></el-input>
    </div>
    <div class="tran_item">
      <el-button @click="onLogin">登录</el-button>
      <el-button @click="onCreatePage">没有账户？</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/login";
</style>
