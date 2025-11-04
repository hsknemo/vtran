<script setup lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { Promotion, CloseBold, HomeFilled } from '@element-plus/icons-vue'
import { onLineUserList } from '@/views/index/store/store.ts'
import { chatMsgList } from '@/views/index/store/chat.ts'
import { ElMessage, ElNotification } from 'element-plus'
import socketReactive from '@/stores/socket.ts'
import { useLocalStorage } from '@vueuse/core'
import { emitter } from '@/event/eventBus.ts'
import GroupChat from '@/views/index/compo/GroupChat.vue'
const highlightIndex = ref(-1)
const userMsg = ref('')

defineComponent({
  name: 'ChatMessage',
})
const props = defineProps({
  popControl: {
    type: Object,
    default: () => ({
      show: false,
    }),
  },
})

const chat_area = ref('chat_area')
const groupPopControl = reactive({
  show: true,
})

const onChatToUser = (row, index) => {
  highlightIndex.value = index
  chatMsgList.currentUser = row
}

const onCloseLinkPanel = () => {
  chatMsgList.currentUser = ''
}

const onMsgTip = () => {
  ElMessage.success('愉快的聊天吧')
}

const scrollToView = async () => {
  await nextTick(_ => {
    // 滚动到底部
    setTimeout(_ => {
      chat_area.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 50)
  })
}

const onSend = async () => {
  if (userMsg.value === '') return ElMessage.warning('输入内容为空')

  // session_id 用户存储当前用户聊天信息 每组用户唯一
  // TODO 刷新页面数据暂时消失
  chatMsgList.currentUser.session_id = chatMsgList.currentUser.id
  chatMsgList.currentUser.sendMsg = userMsg
  chatMsgList.currentUser.from = JSON.parse(useLocalStorage('user').value)
  socketReactive?.ws?.ws?.send(
    JSON.stringify({
      type: 'client-chat-message',
      data: chatMsgList.currentUser,
    }),
  )
  chatMsgList.list[chatMsgList.currentUser.id] = chatMsgList.list[chatMsgList.currentUser.id] || []
  chatMsgList.list[chatMsgList.currentUser.id].push({
    isFrom: false,
    msg: chatMsgList.currentUser.sendMsg,
  })

  scrollToView()

  userMsg.value = ''
}

const getCurChatMsg = ({ data }) => {
  console.log('获取当前的聊天信息...', data.sendMsg)
  chatMsgList.list[data.fromUser.id] = chatMsgList.list[data.fromUser.id] || []
  chatMsgList.list[data.fromUser.id].push({
    isFrom: true,
    msg: data.sendMsg,
  })

  // 消息提醒数字增加
  emitter.emit('chat-message-bell', data)

  if (!props.popControl.show) {
    ElNotification({
      title: `有一条新的消息！---- 来自${data.fromUser.username}`,
      message: data.sendMsg,
      type: 'info',
    })
  } else {
    scrollToView()
  }
}

const onClosePop = () => {
  chatMsgList.currentUser = ''
}

onMounted(() => {
  emitter.on('client-chat-message', getCurChatMsg)
})

const onOpenGroup = () => {
  groupPopControl.show = true
}
</script>

<template>
  <GroupChat
    v-model:group-pop-control="groupPopControl"
  />
  <el-dialog
    @close="onClosePop"
    class="tran_dialog"
    v-model="popControl.show"
    title="聊天"
    :close-on-click-modal="false"
    width="800"
  >
    <main class="tran_chat_main">
      <!--      用户列表区域-->
      <div class="left">
        <header class="tran_chat_header">
          <span>用户列表</span>
          <div class="btn_group">

            <el-tooltip
              class="box-item"
              effect="light"
              content="进入组"
              placement="bottom"
            >
              <el-button @click="onOpenGroup" text :icon="HomeFilled"></el-button>
            </el-tooltip>
          </div>
        </header>
        <main class="tran_chat_user_list">
          <div
            class="user_list_item"
            :class="[
              {
                active: index === highlightIndex,
                online: item.isOnline,
              },
            ]"
            :key="index"
            v-for="(item, index) in onLineUserList.onlineList"
            @click="onChatToUser(item, index)"
          >

            <section :username="item.username.slice(0, 1)" class="user_name">
              {{ item.username }}
            </section>
            <div class="avtor_msg_total" v-if="chatMsgList.list[item.id]">
              <el-badge :value="chatMsgList.list[item.id].length">
              </el-badge>
            </div>
          </div>

        </main>
      </div>

      <!--      聊天区域-->
      <div class="right">
        <template v-if="chatMsgList.currentUser">
          <header class="tran_chat_msg_header">
            <div class="user_name">{{ chatMsgList.currentUser.username }}</div>
            <div class="btn_group">
              <el-button @click="onCloseLinkPanel" text :icon="CloseBold"></el-button>
            </div>
          </header>
          <main class="tran_chat_area">
            <section class="section_pop_chat" ref="chat_area">
              <div
                class="chat_pop"
                :key="index"
                :class="[item.isFrom ? 'user_left_pop' : 'user_right_pop']"
                v-for="(item, index) in chatMsgList.list[chatMsgList.currentUser.id]"
              >
                <div class="msg">
                  {{ item.msg }}
                </div>
              </div>
            </section>
          </main>
          <footer class="tran_chat_footer">
            <el-input @keydown.enter="onSend" type="textarea" v-model="userMsg"></el-input>
            <el-button @click="onSend" :icon="Promotion">发送</el-button>
          </footer>
        </template>
        <div v-else class="tran_chat_logo_panel" @click="onMsgTip">
        </div>
      </div>
    </main>
  </el-dialog>
</template>

<style scoped lang="scss">
@use "@/assets/chat";
</style>
