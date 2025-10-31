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
const ws = ref('')
const reactive_data = reactive({
  page: false,
  showPage: true,
})

function initWS() {
  if (!ws.value) {
    ws.value = new Socket({
      url: import.meta.env.VITE_WS_LINK_ADDR,
      name: '',
      isHeart: true, // 是否心跳
      isReconnection: true, // 是否断开重连
      received(data) {
        let parseData = JSON.parse(data)
        switch (parseData.type) {
          default:
            break
          case 'refreshMessage':
            emitter.emit(parseData.data + '-'  +parseData.value)
        }
        console.log('init ws 收到消息', data)
        ws.value = data
      },
    })
    const data = {
      type: 'init',
    }
    ws.value.connect(data)
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

onMounted(() => {
  checkAuth()

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
      <div class="tip">发送给我的文件列表</div>
      <ProfileFileList />
    </template>

  </main>
</template>

<style scoped lang="scss">
.tran-container {
  .tip {
    margin: 10px 0;
  }
}
</style>
