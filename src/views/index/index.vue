<script setup lang="ts">
import TranUpload from '@/views/index/compo/TranUpload.vue'
import OnlineUser from '@/views/index/compo/OnlineUser.vue'
import ProfileFileList from '@/views/index/compo/ProfileFileList.vue'
import Socket from '@/utils/socket.js'
import { onMounted, reactive, ref } from 'vue'
import CreateUser from '@/views/index/compo/CreateUser.vue'
import Login from '@/views/index/compo/Login.vue'
import ShowUser from '@/views/index/compo/ShowUser.vue'
import { emitter } from '../../event/eventBus.ts'
import { useLocalStorage } from '@vueuse/core'
import { Refresh } from '@element-plus/icons-vue'
import socketReacktive from '@/stores/socket.ts'
const ws = ref('')
const reactive_data = reactive({
  page: false,
  showPage: true,
})

const isTableShow = ref(true)


function initWS() {
  if (!socketReacktive.ws) {
    socketReacktive.ws = new Socket({
      url: 'ws://' + window.location.hostname + ':'+ import.meta.env.VITE_WS_LINK_ADDR,
      name: '',
      isHeart: true, // 是否心跳
      isReconnection: true, // 是否断开重连
      received(data) {
        const parseData = JSON.parse(data)
        console.log('【parseData.type】', parseData.type)
        switch (parseData.type) {
          default:
            break
          case 'refreshMessage':
            emitter.emit(parseData.data + '-'  +parseData.value)
            break
          case 'profile-message':
            emitter.emit('profile-message', parseData)
            break
          // 聊天事件
          case 'client-chat-message':
            emitter.emit('client-chat-message', parseData)
            break
        }
      },
    })
    const data = {
      type: 'init',
    }
    socketReacktive.ws.connect(data)
  }
}

const onPageControl = (bool: boolean) => {
  reactive_data.page = bool
}

const checkAuth = () => {
  const token = localStorage.getItem('Auth')
  if (!token) {
    reactive_data.showPage = true
    return onPageControl(true)
  }
  initWS()
  onClosePage()

  const user = JSON.parse(useLocalStorage('user', '{}').value)
  emitter.on(`refresh-user-list-${user.username}`, () => {
    emitter.emit('refresh-user')
  })
}

const onExit = () => {
  checkAuth()
}

const onClosePage = () => {
  reactive_data.showPage = false
}

const slide_table_list = (bellBool:boolean) => {
  isTableShow.value = bellBool
}

const tableRef = ref('tableRef')
const onTableRefresh = () => {
  tableRef.value.get_file_list()
}

onMounted(() => {
  checkAuth()

  emitter.on('slide-table-list', slide_table_list)

})
</script>

<template>
  <main class="tran-container">
    <template v-if="reactive_data.showPage">
      <Login
        @close-login-page="onClosePage"
        @show-create-page="onPageControl(false)"
        v-if="reactive_data.page"
      />

      <CreateUser
        v-if="!reactive_data.page"
        @close-login-page="onClosePage"
        @has-login="onPageControl(true)"
      />
    </template>

    <template v-if="!reactive_data.showPage">
      <ShowUser @exit="onExit" />
    </template>

    <template v-if="!reactive_data.showPage">
      <div class="tip">选择发送给用户</div>
      <online-user />
      <div class="tip">选择/拖拽文件</div>
      <TranUpload />

      <section v-show="isTableShow">
        <div class="tip">
          发送给我的文件列表
          <section class="btn_control_area">
            <el-button text @click="onTableRefresh" :icon="Refresh"> </el-button>
          </section>
        </div>
        <ProfileFileList ref="tableRef" />
      </section>


    </template>


  </main>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.tran-container {
  .tip {
    margin: 10px 0;
    @include flexStyle(center);
  }
}
</style>
