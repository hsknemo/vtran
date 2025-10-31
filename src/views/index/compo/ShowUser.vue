<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { emitter } from '@/event/eventBus.ts'
const emit = defineEmits(['exit'])
const user = reactive({
  username: '',
})
const bellLen = ref(0)
const bellV = ref(true)
const audio = ref('audio')

const onBellClick = _ => {
  bellV.value = !bellV.value
  emitter.emit('slide-table-list', bellV.value)
}

const getUser = () => {
  const u = localStorage.getItem('user')
  if (u) return JSON.parse(u)
  return {}
}

const onInit = _ => {
  const u = getUser()
  console.log(u, '获取到的用户')
  user.username = u.username
}

const onExit = _ => {
  localStorage.removeItem('user')
  localStorage.removeItem('Auth')
  emit('exit')
}

onMounted(_ => {
  onInit()

  document.addEventListener('click', function () {
    audio.value.muted = true
    audio.value.play()
  })

  emitter.on('refresh-bell-length', (len) => {
    bellLen.value = len
  })

  emitter.on('profile-message', (data) => {
    if (!audio.value) {
      audio.value = ref('audio')
    }
    audio.value.muted = false
    audio.value.play()

    // 接收到发送给自己的文件 刷新文件列表
    emitter.emit('refresh-file')

    setTimeout(_ => {
      audio.value.muted = true
    }, 500)
  })
})

</script>

<template>
  <div class="v_tran_user_panel">
    <h1>欢迎你：{{ user.username }}</h1>
    <audio ref="audio" src="/record/message.mp3"></audio>
    <section class="btn_group">
      <el-button
        @click="onBellClick"
        class="ani_bell" text :icon="Bell">
        <span class="success">{{ bellLen }}</span>
      </el-button>
      <el-button text @click="onExit">退出</el-button>
    </section>
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

  .success {
    color: #fff;
    font-weight: bold;
  }


}
</style>
