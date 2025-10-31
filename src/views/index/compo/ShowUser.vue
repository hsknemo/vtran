<script setup lang="ts">
import { onMounted, reactive } from 'vue'
const emit = defineEmits()
const user = reactive({
  username: '',
})


const getUser = () => {
  const u = localStorage.getItem('user')
  if (u) return JSON.parse(u)
  return {}
}

const onInit = _ => {
  const u = getUser()
  user.username = u.username
}

const onExit = _ => {
  localStorage.removeItem('user')
  localStorage.removeItem('Auth')
  emit('exit')
}

onMounted(_ => {
  onInit()
})

</script>

<template>
  <div class="v_tran_user_panel">
    <h1>欢迎你：{{ user.username }}</h1>
    <el-button text @click="onExit">退出</el-button>
  </div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

.v_tran_user_panel {
  @include flexStyle(center, space-between);
  h1 {
    color: #fff;
    font-weight: bold;
  }
}
</style>
