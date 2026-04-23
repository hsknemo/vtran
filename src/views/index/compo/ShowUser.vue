<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  Bell,
  ChatDotRound,
  Connection,
  Delete,
  Message,
  Expand,
  Mug,
  Refresh,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'
import { emitter } from '@/event/eventBus.ts'
import Chat from '@/views/index/compo/Chat.vue'
import { ElNotification } from 'element-plus'
import {
  checkAllowAudioPlay,
  onSure,
  onSureNot,
  playMedia,
  showMediaConfig,
} from '@/utils/media.ts'
import TranDiaglog from '@/components/TranDiaglog.vue'
const emit = defineEmits(['exit'])
import type { FakeAudio } from '@/type/audio.ts'
import {
  fetchGetProfile,
  onProfileClick,
  profilePopReactive,
} from '@/views/index/service/Profile/profile.ts'
import ProfileInfo from '@/views/index/pageComponent/ProfileInfo.vue'
import { connectStatus } from '@/views/index/store/store.ts'
import { onSponserMe, sponserReactive } from '@/views/index/service/Sponser/sponser.ts'
import SponsorMe from '@/views/index/pageComponent/SponsorMe.vue'
import socketReacktive from '@/stores/socket.ts'
import { dingResult, useGetDingListService, useDeleteDingService, useGetDingUnreadCountService } from '@/service/ding/dingServcie.ts'
const user = reactive({
  username: '',
  ip: '',
  desc: '',
  userImg: '',
  insertTime: '',
})
const dialogSet = reactive({
  show: false,
})

const profile_setting = ref()
const msg = ref('')
const bellLen = ref(0)
const bellV = ref(true)
const chatLen = ref(0)
const dingLen = ref(0)
const dingPop = ref({
  show: false,
})
const onBellClick = (_) => {
  bellV.value = !bellV.value
  emitter.emit('slide-table-list', bellV.value)
}

const onChatClick = (arg) => {
  dialogSet.show = true
}

const onDingClick = async () => {
  await useGetDingListService()
  dingPop.value.show = true
}

const onInit = async () => {
  let { data } = await fetchGetProfile()
  data = data[0]
  user.username = data.username
  user.ip = data.ip
  user.desc = data.desc || ''
  user.userImg = data.userImg
    ? import.meta.env.VITE_API_URL + `/userProfile/${data.id}/${data.userImg}`
    : ''
  msg.value = user.desc
  user.insertTime = data.insertTime
}

const onExit = () => {
  emit('exit')
  localStorage.removeItem('user')
  localStorage.removeItem('Auth')
}

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// const isTyping = ref(true)
// const typingSpeed = 1000 / 10
// const onStartWelcomeMsg = async () => {
//   const content = import.meta.env.VITE_WELCOME_MESSAGE + ' ' + user.desc
//   for (let i = 0; i < content.split('').length; i++) {
//     await delay(typingSpeed)
//     msg.value += content[i]
//   }
//   if (msg.value.length === content.length) {
//     isTyping.value = false
//     await delay(1000)
//   }
// }

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

const onRefreshWsConnect = () => {
  socketReacktive.ws.close()
  socketReacktive.ws.connect({
    type: 'init',
  })
}

onMounted((_) => {
  checkAllowAudioPlay()

  onInit()

  // 获取初始未读消息数量
  const initDingCount = async () => {
    dingLen.value = await useGetDingUnreadCountService()
  }
  initDingCount()

  // 定时5秒请求一次统计接口
  const fetchDingCount = async () => {
    try {
      dingLen.value = await useGetDingUnreadCountService()
    } catch (e) {
      console.error('获取ding消息数量失败:', e)
    } finally {
      // 使用setTimeout递归调用，避免setInterval的问题
      setTimeout(fetchDingCount, 5000)
    }
  }

  // 启动定时请求
  fetchDingCount()

  emitter.on('refresh-bell-length', (len: number) => {
    bellLen.value = len
  })

  // 监听刷新ding消息数量
  emitter.on('refresh-ding-length', async () => {
    dingLen.value = await useGetDingUnreadCountService()
  })

  emitter.on('profile-message', (data) => {
    // 接收到发送给自己的文件 刷新文件列表
    setTimeout((_) => {
      emitter.emit('refresh-file')
    }, 1000)
    ElNotification({
      title: `接收到新文件`,
      type: 'success',
    })
  })

  emitter.on('chat-message-bell', (data) => {
    chatLen.value += 1
    playAudio()
  })

  emitter.on('ding-message-bell', (data) => {
    dingLen.value += 1
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
      <span class="ip">{{ user.ip }}</span>
      <span class="desc">{{ msg }}</span>
    </h3>
    <section class="btn_group">
      <el-tag :type="connectStatus.status">
        <el-icon><Connection /></el-icon>
        <span>{{ connectStatus.statusText }}</span>

        <el-icon @click="onRefreshWsConnect"><refresh /></el-icon>
      </el-tag>
      <el-button @click="onChatClick" class="ani_bell" text :icon="ChatDotRound">
        <span class="success">{{ chatLen }}</span>
      </el-button>
      <el-button @click="onBellClick" class="ani_bell" text :icon="Bell">
        <span class="success">{{ bellLen }}</span>
      </el-button>
      <el-button @click="onDingClick" class="ani_bell" text :icon="Message">
        <span class="success">{{ dingLen }}</span>
      </el-button>

      <div ref="profile_setting" cursor-pointer class="img_author">
        <el-image v-if="user.userImg" :src="user.userImg"></el-image>
        <span v-else>
          {{ user.username.split('')[0] }}
        </span>
      </div>

      <el-popover
        ref="popoverRef"
        :virtual-ref="profile_setting"
        trigger="click"
        title=""
        virtual-triggering
      >
        <div class="popover_setting">
          <section class="setting_item" @click="onProfileClick">
            <el-icon>
              <Setting />
            </el-icon>
            个人设置
          </section>

          <section class="setting_item" @click="onSponserMe">
            <el-icon><Mug /></el-icon>
            赞赏我
          </section>

          <section class="setting_item" @click="onExit">
            <el-icon><SwitchButton /></el-icon>
            退出
          </section>
        </div>
      </el-popover>
    </section>
  </div>

  <Chat v-model:popControl="dialogSet" />

  <TranDiaglog
    title="是否播放声音？"
    :style="{
      height: '200px',
    }"
    v-model:pop-control="showMediaConfig"
  >
    <template #default> 是否允许页面播放媒体？ </template>
    <template #footer>
      <el-button @click="onSureNot">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </TranDiaglog>

  <TranDiaglog
    title="个人信息"
    v-if="profilePopReactive.show"
    v-model:pop-control="profilePopReactive"
  >
    <ProfileInfo @refresh-user-info="onInit" :userInfo="user" />
  </TranDiaglog>

  <TranDiaglog title="赞赏我" v-if="sponserReactive.show" v-model:pop-control="sponserReactive">
    <SponsorMe />
  </TranDiaglog>

  <TranDiaglog title="来自叮一叮的消息" v-model:pop-control="dingPop">
    <div class="ding_list">
      <div v-if="dingResult.length === 0" class="no_data">
        暂无来自叮一叮的消息
      </div>
      <div class="ding_item" v-for="(item, index) in dingResult" :key="index">
        <div class="ding_header">
          <span class="from_user">来自：{{ item.fromUserName }}</span>
          <div class="ding_actions">
            <span class="time">{{ item.insertTime }}</span>
            <el-button size="small" type="danger" circle @click="useDeleteDingService(item.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="ding_content">{{ item.dingMsg }}</div>
      </div>
    </div>
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

      .desc {
        font-size: 12px;
        color: rgb(128, 128, 128);
      }

      .ip {
        font-size: 12px;
        margin-right: 10px;
      }
    }
  }

  .success {
    color: #fff;
    font-weight: bold;
  }

  .btn_group {
    @include flexStyle(center);
    :deep .el-tag__content {
      @include flexStyle(center);
      span {
        margin-left: 4px;
      }
    }

    .img_author {
      --size: 40px;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      overflow: hidden;
      &:hover {
        animation: rotate 0.4s forwards linear;
      }

      span {
        @include flexStyle(center, center);
        width: 100%;
        height: 100%;
        color: rgb(128, 128, 128);
        text-align: center;
      }
    }
  }
}

@keyframes rotate {
  0% {
    box-shadow: 0 0 0px 0 #fff;
  }

  100% {
    box-shadow: 0 0 50px 40px #fff;
  }
}

.popover_setting {
  .setting_item {
    @include flexStyle(center);
    cursor: pointer;
    font-size: 12px;
    transition: color 0.1s linear;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
    .el-icon {
      margin-right: 5px;
    }
    &:hover {
      color: rgb(128, 128, 128);
    }
  }
}

.ding_list {
  max-height: 400px;
  overflow-y: auto;

  .no_data {
    text-align: center;
    color: #999;
    padding: 20px 0;
  }

  .ding_item {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;

    .ding_header {
      @include flexStyle(center, space-between);
      margin-bottom: 8px;

      .from_user {
        font-weight: 600;
        color: #e94560;
      }

      .ding_actions {
        @include flexStyle(center);
        gap: 8px;

        .time {
          font-size: 12px;
          color: #999;
        }

        .el-button {
          --el-button-size: 20px;
          padding: 0;
        }
      }
    }

    .ding_content {
      font-size: 14px;
      line-height: 1.5;
      color: #f0f0f0;
      word-break: break-all;
    }
  }
}
</style>
