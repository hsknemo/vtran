<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'
import { CloseBold, Plus, Promotion, Switch, User, Back } from '@element-plus/icons-vue'
import CreateGroupForm from '@/views/index/compo/CreateGroupForm.vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { findOwnGroup, findOwnGroupUser } from '@/api/group/group.ts'
import { useLocalStorage } from '@vueuse/core'
import { chatMsgList } from '@/views/index/store/chat.ts'
import InvitionUser from '@/views/index/compo/InvitionUser.vue'
import socketReactive from '@/stores/socket.ts'
import { emitter } from '@/event/eventBus.ts'
import ChatUtilsBar from '@/views/index/compo/ChatUtilsBar.vue'
import { codeGroupReactive } from '@/views/index/service/ChatUtilsService/chatUtils.ts'
import MonoDialog from '@/views/index/pageComponent/MonoDialog.vue'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
const isSaveGroup = ref(false)
const groupShow = ref(false)
const highlightIndex = ref(-1)
const userMsg = ref('')
const groupChat = reactive({
  list: [],
  curGroupUserList: [],
})
const user_list_drawer = ref(false)
const direction = ref('rtl')
const handleClose = (done) => {
  done()
}
const props = defineProps({
  groupPopControl: {
    type: Object,
    default: () => {
      return {
        show: false,
      }
    },
  },
})

const onCloseLinkPanel = () => {
  chatMsgList.currentGroup = ''
}

const onClosePop = () => {
  props.groupPopControl.show = false
}

const onCreateGroup = () => {
  groupShow.value = true
}
const onCloseCreateGroup = () => {
  groupShow.value = false
}

/**
 * 获取群列表
 */
const findOwnGroupFetch = async () => {
  try {
    const res = await findOwnGroup({
      userId: JSON.parse(useLocalStorage('user').value).id,
    })
    groupChat.list = res.data
    groupShow.value = false
  } catch (e) {
    ElMessage.error('获取群列表失败')
  }
}

const onChatToGroupUser = (row, index) => {
  highlightIndex.value = index
  chatMsgList.currentGroup = row
}
const chat_area = ref('chat_area')

const scrollToView = async () => {
  await nextTick((_) => {
    // 滚动到底部
    setTimeout((_) => {
      chat_area.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 50)
  })
}

const onSend = () => {
  if (userMsg.value === '') return ElMessage.warning('输入内容为空')
  let ifUserList = chatMsgList.currentGroup.userList.length == 1
  chatMsgList.currentGroup.session_id = chatMsgList.currentGroup.id
  chatMsgList.currentGroup.sendMsg = userMsg
  chatMsgList.currentGroup.from = JSON.parse(useLocalStorage('user').value)
  // 有群用户的情况下 推送消息给其他用户
  if (!ifUserList) {
    socketReactive?.ws?.ws?.send(
      JSON.stringify({
        type: 'client-chat-group-message',
        data: chatMsgList.currentGroup,
      }),
    )
  }

  chatMsgList.groupList[chatMsgList.currentGroup.id] =
    chatMsgList.groupList[chatMsgList.currentGroup.id] || []
  chatMsgList.groupList[chatMsgList.currentGroup.id].push({
    isFrom: false,
    msg: chatMsgList.currentGroup.sendMsg,
  })

  scrollToView()
  userMsg.value = ''
  saveGroupInfo()


}

const onMsgTip = () => {
  ElMessage.success('愉快的聊天吧')
}

const onGetGroupUserList = () => {
  user_list_drawer.value = !user_list_drawer.value
  if (user_list_drawer.value) {
    getGroupUserList()
  } else {
    groupChat.curGroupUserList = []
  }
}

const getGroupUserList = async () => {
  try {
    const res = await findOwnGroupUser({
      groupId: chatMsgList.currentGroup.id,
    })
    groupChat.curGroupUserList = res.data
  } catch (e) {
    ElMessage.error('获取群用户列表失败')
  }
}
const invitationPanel = ref(false)
const onInvitionUser = () => {
  invitationPanel.value = !invitationPanel.value
}

/**
 * 邀请人入组后 刷新列表 刷新组用户列表 刷新组用户
 * @param groupId
 */
const onRefreshCurrentGroup = async (groupId: string) => {
  await findOwnGroupFetch()
  const groupData = groupChat.list.filter((item) => item.id === groupId)
  chatMsgList.currentGroup = groupData[0]
  await getGroupUserList()
}

/**
 * @description 接收群消息
 * @param data
 */
const getCurChatMsg = ({ data }) => {
  console.log('获取当前的聊天信息...', data.sendMsg)
  chatMsgList.groupList[data.session_id] = chatMsgList.groupList[data.session_id] || []
  chatMsgList.groupList[data.session_id].push({
    isFrom: true,
    username: data.fromUser.username,
    msg: data.sendMsg,
  })

  scrollToView()

  saveGroupInfo()


}

const saveGroupInfo = () => {
  let isSave = localStorage.getItem('isSaveGroup')
  if (isSave == 'true') {
    try {
      localStorage.setItem('groupData', JSON.stringify(chatMsgList.groupList))
    } catch (e) {
      ElMessage.warning('组信息保存失败', e)
    }
  }
}

const onChangeGroupSave = (val) => {
  console.log('保存群消息', val)
  if (val) {
    localStorage.setItem('isSaveGroup', 'true')
    saveGroupInfo()
  } else {
    localStorage.setItem('isSaveGroup', 'false')
  }
}

/**
 * 挂载时候是否要读取组信息
 */
const mountedGetGroupData = () => {
  let isSave = localStorage.getItem('isSaveGroup')
  if (isSave == 'true') {
    isSaveGroup.value = true
    let groupData = localStorage.getItem('groupData')
    if (groupData) {
      chatMsgList.groupList = JSON.parse(groupData)


    }
  }
}

const addGroupFromUser = async ({ data }) => {
  let userId = JSON.parse(useLocalStorage('user').value).id
  if (data.createUserId == userId) {
    return
  }
  ElNotification({
    title: `有一条新的消息！---- 来自群聊添加`,
    message: `您被添加到新的群聊【${data.name}】，正在刷新群列表...`,
    type: 'success',
  })
  await findOwnGroupFetch()
}

// 点击编辑器
const onCodeEditorEnter = (val) => {
  userMsg.value = val
}


const onEmojiTextSelect = emoji => {
  userMsg.value += emoji
}

onMounted(() => {
  findOwnGroupFetch()

  // 接收群消息
  emitter.on('client-chat-group-message', getCurChatMsg)

  emitter.on('chat-group-add-user-event', addGroupFromUser)

  mountedGetGroupData()
})
</script>

<template>
  <el-dialog
    @close="onClosePop"
    class="tran_dialog"
    v-model="groupPopControl.show"
    title="组聊天"
    :close-on-click-modal="false"
    width="800"
  >
    <CreateGroupForm
      @group-created="findOwnGroupFetch"
      @form-reback="onCloseCreateGroup"
      v-if="groupShow"
    />
    <main class="tran_chat_main" v-else>
      <div class="left">
        <header class="tran_chat_header">
          <span>我的组</span>
          <div class="btn_group">
            <el-tooltip class="box-item" effect="light" content="创建组" placement="bottom">
              <el-button @click="onCreateGroup" text :icon="Plus"></el-button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="light" content="保存消息到本地" placement="bottom">
              <el-switch
                @change="onChangeGroupSave"
                v-model="isSaveGroup"
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
              },
            ]"
            :key="index"
            v-for="(item, index) in groupChat.list"
            @click="onChatToGroupUser(item, index)"
          >
            <section :username="item.name.slice(0, 1)" class="group_name">
              {{ item.name }}
            </section>

            <div class="avtor_msg_total" v-if="chatMsgList.groupList[item.id]">
              <el-badge :value="chatMsgList.groupList[item.id].length"> </el-badge>
            </div>
          </div>
        </main>
      </div>

      <div class="right">
        <template v-if="chatMsgList.currentGroup">
          <header class="tran_chat_msg_header group">
            <div class="user_name">
              <section class="chat_tit">群聊：{{ chatMsgList.currentGroup.name }}</section>
              <section @click="onGetGroupUserList" class="drawer_control">
                <el-tooltip content="用户列表" effect="light">
                  <el-icon><Switch /></el-icon>
                </el-tooltip>
              </section>
            </div>

            <div class="btn_group">
              <el-button @click="onCloseLinkPanel" text :icon="CloseBold"></el-button>
            </div>
          </header>
          <main class="tran_chat_area">
            <section class="section_pop_chat" ref="chat_area">
              <div
                class="chat_pop group_chat_pop"
                :key="index"
                :class="[item.isFrom ? 'user_left_pop' : 'user_right_pop']"
                v-for="(item, index) in chatMsgList.groupList[chatMsgList.currentGroup.id]"
              >
                <div class="user_show">
                  {{ item.isFrom ? item.username : '我' }}
                </div>
                <div>
                  <div class="msg">
<!--                    {{ item.msg }}-->
                    <component
                      :value="item.msg"
                      :is="MarkdownMsg"></component>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer class="tran_chat_footer">
            <section class="footer_item none_flex_end">
              <ChatUtilsBar
                :is-group="true"
                @emoji-text-select="onEmojiTextSelect"
              />
            </section>
            <section class="footer_item">
              <el-input  type="textarea" v-model="userMsg"></el-input>
              <el-button @click="onSend" :icon="Promotion">发送</el-button>
            </section>

          </footer>
        </template>

        <div v-else class="tran_chat_logo_panel" @click="onMsgTip"></div>
      </div>
    </main>
    <el-drawer
      modal-class="chat_drawer"
      :modal="false"
      modal-penetrable
      v-model="user_list_drawer"
      title="用户列表"
      :direction="direction"
      :before-close="handleClose"
    >
      <section class="control_bar">
        <el-tooltip
          placement="left"
          effect="light"
          :content="invitationPanel ? '返回' : '邀请成员'"
        >
          <el-button @click="onInvitionUser" :icon="invitationPanel ? Back : User" text>
          </el-button>
        </el-tooltip>
      </section>
      <InvitionUser
        @refresh-current-group="onRefreshCurrentGroup"
        :groupId="chatMsgList.currentGroup.id"
        :hasGroupUser="chatMsgList.currentGroup.userList"
        v-if="invitationPanel"
      />
      <section v-else class="user_list">
        <div
          class="user_list_item"
          :key="index"
          v-for="(item, index) in groupChat.curGroupUserList"
        >
          <section
            class="user_name"
            :class="[
              {
                is_group_creator: item.id === chatMsgList.currentGroup.createUserId,
              },
            ]"
          >
            <el-icon v-if="item.id === chatMsgList.currentGroup.createUserId"><User /></el-icon>
            <span class="name">{{ item.username }}</span>
          </section>
        </div>
      </section>
    </el-drawer>

    {{ groupPopControl.show }}
    <mono-dialog
      :is-group="true"
      v-if="groupPopControl.show"
      @form-sure="onCodeEditorEnter"
      v-model:pop-control="codeGroupReactive"
    ></mono-dialog>
  </el-dialog>

</template>

<style scoped lang="scss">
@use '@/assets/chat';
</style>
<style lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@mixin control_bar {
  .control_bar {
    margin-bottom: 5px;
  }
}

@mixin user_list() {
  .user_list {
    height: calc(100% - 60px);
    overflow: auto;

    .user_list_item {
      padding: 10px;
      background-color: #1d1d1d;
      margin-bottom: 10px;
      border-radius: 5px;
      &:last-child {
        margin-bottom: unset;
      }
      .user_name {
        @include flexStyle(center);

        &.is_group_creator {
          --color: gold;
          .el-icon {
            color: var(--color);
          }
          .name {
            font-weight: bold;
            color: var(--color);
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.chat_drawer {
  pointer-events: none !important;
  .el-drawer {
    pointer-events: auto !important;
  }

  @include user_list();

  @include control_bar();
}
</style>
