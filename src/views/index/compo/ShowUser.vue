<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Bell, ChatDotRound } from '@element-plus/icons-vue'
import { emitter } from '@/event/eventBus.ts'
import Chat from '@/views/index/compo/Chat.vue'
import { ElNotification } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'
const emit = defineEmits(['exit'])
const user = reactive({
  username: '',
})
const dialogSet = reactive({
  show: false,
})
const msg = ref('')
const bellLen = ref(0)
const bellV = ref(true)
const audio = ref('audio')
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

const onInit = (args:never) => {
  const u = getUser()
  user.username = u.username
}

const onExit = _ => {
  emit('exit')
  localStorage.removeItem('user')
  localStorage.removeItem('Auth')
}


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const isTyping = ref(true)
const typingSpeed = 1000 / 10
const onStartWelcomeMsg = async () => {
  const content = import.meta.env.VITE_WELCOME_MESSAGE + ':'+ user.username
  for (let i = 0; i < content.split('').length; i++) {
    await delay(typingSpeed)
    msg.value += content[i]
  }
  if (msg.value.length === content.length) {
    isTyping.value = false
    await delay(1000)
    cancelStartWelComeMsg()
  }
}

const cancelStartWelComeMsg = async _ => {
  for (let i = msg.value.split('').length; i >0; i--) {
    await delay(typingSpeed)
    msg.value = msg.value.slice(0, i - 1)
  }
  if (!msg.value) {
    onStartWelcomeMsg()
  }
}

const playAudio = _ => {
  try {
    if (!audio.value) {
      audio.value = ref('audio')
    }
    audio.value.muted = false
    audio.value.play()

    setTimeout(_ => {
      audio.value.muted = true
    }, 500)
  } catch (e) {
    audio.value.muted = false
    audio.value.play()
  }
}

onMounted(_ => {
  onInit()

  onStartWelcomeMsg()

  document.addEventListener('click', function () {
    audio.value.muted = true
    audio.value.play()
  })

  emitter.on('refresh-bell-length', (len:number) => {
    bellLen.value = len
  })

  emitter.on('profile-message', (data) => {
    // 接收到发送给自己的文件 刷新文件列表
    emitter.emit('refresh-file')
    ElNotification({
      title: `接收到新文件`,
      type: 'success',
    })
  })

  emitter.on('chat-message-bell', data => {
    chatLen.value += 1
    playAudio()
  })
})
</script>

<template>
  <div class="v_tran_user_panel">
    <h3 class="typing">
      <span class="cursor">{{ msg }}</span>
    </h3>
    <audio ref="audio" src="/record/message.mp3"></audio>
    <section class="btn_group">
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
    }
  }

  .success {
    color: #fff;
    font-weight: bold;
  }
}
</style>
