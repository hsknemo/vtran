<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Bell, ChatDotRound, Connection } from '@element-plus/icons-vue'
import { emitter } from '@/event/eventBus.ts'
import Chat from '@/views/index/compo/Chat.vue'
import { ElNotification } from 'element-plus'
import { checkAllowAudioPlay, onSure, onSureNot, playMedia, showMediaConfig } from '@/utils/media.ts'
import TranDiaglog from '@/components/TranDiaglog.vue'
const emit = defineEmits(['exit'])
import type{ FakeAudio} from '@/type/audio.ts'
const user = reactive({
  username: '',
  ip: '',
})
const dialogSet = reactive({
  show: false,
})

const connectStatus = reactive({
  status: 'danger',
  statusText: '未连接',
})

const msg = ref('')
const bellLen = ref(0)
const bellV = ref(true)
const chatLen = ref(0)
const onBellClick = _ => {
  bellV.value = !bellV.value
  emitter.emit('slide-table-list', bellV.value)
}

const onChatClick = arg => {
  dialogSet.show = true
}

const getUser = () => {
  const u = localStorage.getItem('user')
  if (u) return JSON.parse(u)
  return {}
}

const onInit = () => {
  const u = getUser()
  user.username = u.username
  user.ip = u.ip
}

const onExit = () => {
  emit('exit')
  localStorage.removeItem('user')
  localStorage.removeItem('Auth')
}


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const isTyping = ref(true)
const typingSpeed = 1000 / 10
const onStartWelcomeMsg = async () => {
  const content = import.meta.env.VITE_WELCOME_MESSAGE + ' '+ user.username
  for (let i = 0; i < content.split('').length; i++) {
    await delay(typingSpeed)
    msg.value += content[i]
  }
  if (msg.value.length === content.length) {
    isTyping.value = false
    await delay(1000)
  }
}

const playM = ref<HTMLAudioElement | FakeAudio>(playMedia())
const playAudio = () => {
  try {
    playM.value.muted = false
    playM.value.play()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.log('不支持播放')
  }
}

onMounted(_ => {
  checkAllowAudioPlay()

  onInit()

  onStartWelcomeMsg()

  emitter.on('refresh-bell-length', (len:number) => {
    bellLen.value = len
  })

  emitter.on('profile-message', (data) => {
    // 接收到发送给自己的文件 刷新文件列表
    setTimeout(_ => {
      emitter.emit('refresh-file')
    }, 1000)
    ElNotification({
      title: `接收到新文件`,
      type: 'success',
    })
  })

  emitter.on('chat-message-bell', data => {
    chatLen.value += 1
    playAudio()
  })

  emitter.on('pone', (data) => {
    if (connectStatus.status === 'success') return
    connectStatus.status = 'success'
    connectStatus.statusText = '已连接'
  })
})
</script>

<template>
  <div class="v_tran_user_panel">
    <h3 class="typing">
      <span class="cursor">{{ msg }}</span>
      <span class="ip">{{ user.ip }}</span>
    </h3>
    <section class="btn_group">
      <el-tag :type="connectStatus.status">
        <el-icon><Connection /></el-icon>
        <span>{{ connectStatus.statusText }}</span>
      </el-tag>
      <el-button @click="onChatClick" class="ani_bell" text :icon="ChatDotRound">
        <span class="success">{{ chatLen }}</span>
      </el-button>

      <el-button @click="onBellClick" class="ani_bell" text :icon="Bell">
        <span class="success">{{ bellLen }}</span>
      </el-button>
      <el-button text @click="onExit">退出</el-button>
    </section>
  </div>
  <Chat v-model:popControl="dialogSet" />

  <TranDiaglog
    title="是否播放声音？"
    :style="{
      height: '200px',
    }"
    v-model:pop-control="showMediaConfig">
    <template #default>
     是否允许页面播放媒体？
    </template>
    <template #footer>
      <el-button @click="onSureNot">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </TranDiaglog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.v_tran_user_panel {
  @include flexStyle(center, space-between);
  h3 {
    color: #fff;
    font-weight: bold;

    &.typing {
      &::after {
        content: '_';
        font-size: 14px;
        padding-left: 4px;
        animation: blink 0.5s infinite;
      }

      .ip {
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }

  .success {
    color: #fff;
    font-weight: bold;
  }

  .btn_group {
    :deep .el-tag__content {
      @include flexStyle(center);
      span {
        margin-left: 4px;
      }
    }
  }
}
</style>
