<script setup lang="ts">
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { CloseBold, HomeFilled } from '@element-plus/icons-vue'
import { onLineUserList } from '@/views/index/store/store.ts'
import { chatMsgList } from '@/views/index/store/chat.ts'
import { ElMessage, ElNotification } from 'element-plus'
import socketReactive from '@/stores/socket.ts'
import { useLocalStorage } from '@vueuse/core'
import { emitter } from '@/event/eventBus.ts'
import GroupChat from '@/views/index/compo/GroupChat.vue'
import { codeReactive } from '@/views/index/service/ChatUtilsService/chatUtils.ts'
import MonoDialog from '@/views/index/pageComponent/MonoDialog.vue'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
import UploadDia from '@/views/index/pageComponent/UploadDia.vue'
import IconUploadHistory from '@/components/icons/iconUploadHistory.vue'
import UploadHistory from '@/views/index/pageComponent/UploadHistory.vue'
import EmojiSymbol from '@/components/EmojiSymbol/EmojiSymbol.vue'
import ChatMsg from '@/views/index/compo/ChatMsg.vue'

const highlightIndex = ref(-1)
const userMsg = ref('')
const isSaveUserChatMsg = ref(false)

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
  show: false,
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
  await nextTick((_) => {
    // 滚动到底部
    setTimeout((_) => {
      chat_area.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 50)
  })
}

const onSend = async (msg) => {
  // session_id 用户存储当前用户聊天信息 每组用户唯一
  // TODO 刷新页面数据暂时消失
  chatMsgList.currentUser.session_id = chatMsgList.currentUser.id
  chatMsgList.currentUser.sendMsg = msg
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

  saveUserInfo()
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

  saveUserInfo()
}

const onClosePop = () => {
  chatMsgList.currentUser = ''
}

const onOpenGroup = () => {
  groupPopControl.show = true
}

const saveUserInfo = () => {
  let isSave = localStorage.getItem('isSaveUserChatMsg')
  if (isSave == 'true') {
    try {
      localStorage.setItem('userChatData', JSON.stringify(chatMsgList.list))
    } catch (e) {
      ElMessage.warning('用户聊天信息保存失败', e)
    }
  }
}

const onChangeUserChatSave = (val) => {
  console.log('保存群消息', val)
  if (val) {
    localStorage.setItem('isSaveUserChatMsg', 'true')
    saveUserInfo()
  } else {
    localStorage.setItem('isSaveUserChatMsg', 'false')
  }
}
/**
 * 挂载时候是否要读取用户聊天信息
 */
const mountedGetUserChatMsgData = () => {
  let isSave = localStorage.getItem('isSaveUserChatMsg')
  if (isSave == 'true') {
    isSaveUserChatMsg.value = true
    let userChatMsgData = localStorage.getItem('userChatData')
    if (userChatMsgData) {
      chatMsgList.list = JSON.parse(userChatMsgData)
    }
  }
}

const clearChatAllOnExit = () => {
  chatMsgList.list = {}
  chatMsgList.currentUser = ''
  chatMsgList.groupList = {}
  chatMsgList.currentGroup = ''
}

// 点击编辑器
const onCodeEditorEnter = (val) => {
  onSend(val)
}

const uploadHis = reactive({
  show: false,
})
const onClickShowHistory = () => {
  uploadHis.show = true
}

const onUploadSuccess = () => {
  onSend('提示：双方互传文件，请打开历史文件进行查看！')
}

onMounted(() => {
  emitter.on('client-chat-message', getCurChatMsg)

  emitter.on('clear-chat-all', clearChatAllOnExit)

  mountedGetUserChatMsgData()
})
</script>

<template>
  <GroupChat v-model:group-pop-control="groupPopControl" />
  <el-dialog
    draggable
    overflow
    @close="onClosePop"
    class="tran_dialog"
    v-model="popControl.show"
    title="聊天"
    :close-on-click-modal="false"
    style="--el-dialog-margin-top: 4vh"
    width="1000px"
  >
    <main class="tran_chat_main">
      <!--      用户列表区域-->
      <div class="left">
        <header class="tran_chat_header">
          <span>用户列</span>
          <div class="btn_group">
            <el-tooltip class="box-item" effect="light" content="进入组" placement="bottom">
              <el-button @click="onOpenGroup" text :icon="HomeFilled"></el-button>
            </el-tooltip>

            <el-tooltip class="box-item" effect="light" content="保存消息到本地" placement="bottom">
              <el-switch
                @change="onChangeUserChatSave"
                v-model="isSaveUserChatMsg"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
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
              <el-badge :value="chatMsgList.list[item.id].length"> </el-badge>
            </div>
          </div>
        </main>
      </div>

      <!--      聊天区域-->
      <div class="right">
        <template v-if="chatMsgList.currentUser">
          <header class="tran_chat_msg_header">
            <div class="user_name">
              {{ chatMsgList.currentUser.username }}
              <div class="group_btn">
                <el-tooltip content="文件历史记录" effect="light">
                  <icon-upload-history @click="onClickShowHistory" id="tran_file_his" />
                </el-tooltip>
              </div>
            </div>
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
                  <!--                  {{ item.msg }}-->
                  <component :value="item.msg" :is="MarkdownMsg"></component>
                </div>
              </div>
            </section>
          </main>
          <ChatMsg @send-message="onSend" />
        </template>
        <div v-else class="tran_chat_logo_panel" @click="onMsgTip"></div>
      </div>
    </main>
  </el-dialog>
  <mono-dialog
    v-if="!groupPopControl.show"
    @form-sure="onCodeEditorEnter"
    v-model:pop-control="codeReactive"
  ></mono-dialog>

  <UploadDia v-model="codeReactive.showUpload" @upload-msg="onUploadSuccess"> </UploadDia>

  <upload-history
    v-if="uploadHis.show"
    :curUserInfo="chatMsgList.currentUser"
    v-model:pop-control="uploadHis"
  ></upload-history>
  <EmojiSymbol v-if="codeReactive.showEmoji" />
</template>

<style scoped lang="scss">
@use '@/assets/chat';
</style>
