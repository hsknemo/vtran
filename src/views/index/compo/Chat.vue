<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Promotion, CloseBold } from '@element-plus/icons-vue'
import { onLineUserList } from '@/views/index/store/store.ts'
import { ElMessage } from 'element-plus'
import socketReactive from '@/stores/socket.ts'
import { useLocalStorage } from '@vueuse/core'
import { emitter } from '@/event/eventBus.ts'
const highlightIndex = ref(-1)
const userMsg = ref('')
const chatMsgList = reactive({
  list: {},
  currentUser: '',
})
defineComponent({
  name: 'ChatMessage',
})
defineProps({
  popControl: {
    type: Object,
    default: () => ({
      show: false,
    }),
  },
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

const onSend = async () => {
  if (userMsg.value === '') return ElMessage.warning('输入内容为空')

  // session_id 用户存储当前用户聊天信息 每组用户唯一
  // TODO 刷新页面数据暂时消失
  chatMsgList.currentUser.session_id = chatMsgList.currentUser.id
  chatMsgList.currentUser.sendMsg = userMsg
  chatMsgList.currentUser.from = JSON.parse(useLocalStorage('user', '{}').value)
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

  userMsg.value = ''
}

const getCurChatMsg = ({ data }) => {
  console.log('获取当前的聊天信息...', data.sendMsg)
  chatMsgList.list[chatMsgList.currentUser.id] = chatMsgList.list[chatMsgList.currentUser.id] || []
  chatMsgList.list[chatMsgList.currentUser.id].push({
    isFrom: true,
    msg: data.sendMsg,
  })
  emitter.emit('chat-message-bell', data)
}

onMounted(() => {
  emitter.on('client-chat-message', getCurChatMsg)
})
</script>

<template>
  <el-dialog
    class="tran_dialog"
    v-model="popControl.show"
    title="聊天"
    :close-on-click-modal="false"
    width="800"
  >
    <main class="tran_chat_main">
      <!--      用户列表区域-->
      <div class="left">
        <header class="tran_chat_header">用户列表</header>
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
            <section class="section_pop_chat">
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
          <!--          TranMsg-->
        </div>
      </div>
    </main>
  </el-dialog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

$block_bg_color: #1d1d1d;

@mixin radius_box($bgColor: $block_bg_color, $padding: 8px 8px, $radius: 5px) {
  background-color: $bgColor;
  padding: $padding;
  border-radius: $radius;
}

@mixin tran_chat_header {
  .tran_chat_header {
    @include radius_box();
  }
}

@mixin tran_chat_user_list {
  .tran_chat_user_list {
    @include radius_box();
    margin-top: 10px;
    height: calc(100% - 10%);

    .user_list_item {
      @include radius_box(#262626, 10px 10px);
      margin-bottom: 10px;
      transition: all 0.3s linear;
      border: 2px solid transparent;
      &:hover,
      &.active {
        cursor: pointer;
        background-color: #424242;
        border: 2px solid #313030;
      }

      &.online {
        .user_name {
          &:after {
            background-color: #74f574;
          }
        }
      }

      .user_name {
        @include flexStyle(center);
        &:before {
          content: attr(username);
          width: 20px;
          height: 20px;
          margin-right: 10px;
          background-color: #3d3d3d;
          text-align: center;
          border-radius: 5px;
          font-weight: bold;
        }

        &:after {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-left: 60px;
          background-color: #696d69;
        }
      }
    }
  }
}

@mixin tran_chat_footer {
  .tran_chat_footer {
    padding-top: 10px;
    @include flexStyle(center, end);
  }
}

@mixin section_pop_chat() {
  .section_pop_chat {
    .chat_pop {
      width: 100%;
      @include flexStyle(center);
      margin-bottom: 10px;
      .msg {
        width: fit-content;
        @include radius_box(#353535, 10px 10px, 5px);
      }
      .dict {
        font-size: 10px;
        color: #eee;
      }
      &.user_right_pop {
        justify-content: end;
      }
      &.user_left_pop {
        .msg {
          background-color: #388e3c;
        }
      }
    }
  }
}

@mixin tran_chat_area {
  .tran_chat_area {
    margin-top: 10px;
    height: calc(100% - 20%);
    @include radius_box(#141414);
    overflow: auto;
  }
}

@mixin tran_chat_msg_header {
  .tran_chat_msg_header {
    padding-left: 4px;
    @include flexStyle(center, space-between);
  }
}

@mixin tran_chat_logo_panel {
  .tran_chat_logo_panel {
    font-size: 120px;
    height: 100%;
    @include flexStyle(center, center);

    color: #565656;
    transition: all 0.3s;
    user-select: none;
    &:hover {
      color: #fff;
      &:before {
        content: '不止于此';
      }
    }

    &:before {
      font-family: fantasy;
      content: 'TranMsg';
    }
  }
}

.tran_dialog {
  .tran_chat_main {
    height: 500px;
    @include flexStyle(center);
    .left,
    .right {
      height: 100%;
    }
    .left {
      width: 20%;
      @include tran_chat_header();
      @include tran_chat_user_list();
    }
    .right {
      flex: 1;
      margin-left: 10px;
      @include radius_box();

      @include tran_chat_msg_header();

      @include tran_chat_area();

      @include tran_chat_footer();

      @include section_pop_chat();

      @include tran_chat_logo_panel();
    }
  }
}
</style>
