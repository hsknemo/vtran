<script setup lang="ts">
import TranUpload from '@/views/index/compo/TranUpload.vue'
import OnlineUser from '@/views/index/compo/OnlineUser.vue'
import ProfileFileList from '@/views/index/compo/ProfileFileList.vue'
import ProfileSentOtherUserList from '@/views/index/compo/ProfileSentOtherUserList.vue'
import Socket from '@/utils/socket.js'
import { computed, onMounted, reactive, ref } from 'vue'
import ShowUser from '@/views/index/compo/ShowUser.vue'
import { emitter } from '../../event/eventBus.ts'
import { useLocalStorage } from '@vueuse/core'
import { CirclePlus, Delete, Refresh } from '@element-plus/icons-vue'
import socketReacktive from '@/stores/socket.ts'
import { onLineUserList } from '@/views/index/store/store.ts'
import { useRouter } from 'vue-router'
import { version as v } from '../../../package.json'
import TranDiaglog from '@/components/TranDiaglog.vue'
import { ElMessage } from 'element-plus'
import { getVersionList, saveVersionList } from '@/api/version/version.ts'
const router = useRouter()
const versionOption = ref([
  {
    name: '功能修复',
    value: 'bug',
  },
  {
    name: '功能增加',
    value: 'feature',
  },
  {
    name: '功能告警',
    value: 'warn',
  },
])
const version = ref('当前版本' + v)
const versionList = ref([])
const userAuth = computed(() => {
  const auth = JSON.parse(useLocalStorage('user').value).auth || []
  return auth
})

const versionPop = ref({
  show: false,
})
const versionForm = ref({
  versionTitle: v,
  versionDesc: '',
  versionType: '',
  versionContent: [],
})

const getTagType = (type) => {
  switch (type) {
    default:
      return 'primary'
    case 'bug':
      return 'danger'
    case 'feature':
      return 'success'
    case 'warn':
      return 'warning'
  }
}
const getColor = type => {
  switch (type) {
    default:
      return '--el-color-primary'
    case 'bug':
      return '--el-color-danger'
    case 'feature':
      return '--el-color-success'
    case 'warn':
      return '--el-color-warning'
  }
}


const onAddVersion = () => {
  version_list_cut.value = true
}
const onAddVersionItem = () => {
  versionForm.value.versionContent.push({
    type: versionForm.value.versionType,
    content: versionForm.value.versionDesc,
  })
  versionForm.value.versionType = ''
  versionForm.value.versionDesc = ''
}

/**
 * 添加版本
 */
const onAddVersionSubmit = async () => {
  try {
    if (!versionForm.value.versionTitle) return ElMessage.error('版本标题数据为空')
    if (!versionForm.value.versionContent.length) return ElMessage.error('版本描述数据为空')

    await saveVersionList({
      versionTitle: versionForm.value.versionTitle,
      versionList: versionForm.value.versionContent,
    })
    ElMessage.success('添加成功')
    version_list_cut.value = false
    versionPop.value.show = false
    await fetchGetVersionList()
  } catch (e) {
    console.log('error', e)
    ElMessage.error('添加失败')
  }
}

const onDeleteItem = (item) => {
  versionForm.value.versionContent = versionForm.value.versionContent.filter((it) => it !== item)
}
const version_list_cut = ref(false)
const onVersionClick = () => {
  versionPop.value.show = true
}

const reactive_data = reactive({
  page: false,
  showPage: true,
})

const isTableShow = ref(true)

const initWS = () => {
  if (!socketReacktive.ws) {
    socketReacktive.ws = new Socket({
      url: 'ws://' + window.location.hostname + ':' + import.meta.env.VITE_WS_LINK_ADDR,
      name: '',
      isHeart: true, // 是否心跳
      isReconnection: true, // 是否断开重连
      received(data) {
        const parseData = JSON.parse(data)
        switch (parseData.type) {
          default:
            break
          case 'pong':
            // 心跳回应:
            emitter.emit('pone')
            break
          case 'refreshMessage':
            emitter.emit(parseData.data + '-' + parseData.value)
            break
          case 'profile-message':
            emitter.emit('profile-message', parseData)
            break
          // 聊天事件
          case 'client-chat-message':
            emitter.emit('client-chat-message', parseData)
            break
          // 组聊天事件
          case 'client-chat-group-message':
            emitter.emit('client-chat-group-message', parseData)
            break
          // 群聊加入事件
          case 'chat-group-add-user-event':
            emitter.emit('chat-group-add-user-event', parseData)
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
    localStorage.removeItem('Auth')
    localStorage.removeItem('user')
    reactive_data.showPage = true
    return onPageControl(true)
  }
  initWS()
  onClosePage()
  fetchGetVersionList()

  const user = JSON.parse(useLocalStorage('user').value)
  emitter.on(`refresh-user-list-${user.username}`, () => {
    emitter.emit('refresh-user')
  })
}

const onExit = () => {
  localStorage.removeItem('isSaveGroup')
  localStorage.removeItem('groupData')
  localStorage.removeItem('isSaveUserChatMsg')
  localStorage.removeItem('userChatData')
  emitter.emit('clear-chat-all')
  onLineUserList.onlineList = []
  router.push('/login')
  checkAuth()
}

emitter.on('logout', onExit)

const onClosePage = () => {
  reactive_data.showPage = false
}

const slide_table_list = (bellBool: boolean) => {
  isTableShow.value = bellBool
}

const tableRef = ref('tableRef')
const profileSentRef = ref('profileSentRef')
const onTableRefresh = () => {
  tableRef.value.get_file_list()
}

const onTableRefreshProfile = () => {
  profileSentRef.value.get_file_list()
}

/**
 * 刷新两个表格数据
 */
const get_all_table_list = () => {
  onTableRefresh()
  onTableRefreshProfile()
}

/**
 * 获取版本列表
 */
const fetchGetVersionList = async () => {
  try {
    const list = await getVersionList()
    versionList.value = list.data
  } catch (e) {
    ElMessage.error('获取版本列表失败')
  }
}

onMounted(() => {
  checkAuth()

  emitter.on('refresh-file', get_all_table_list)

  emitter.on('slide-table-list', slide_table_list)
})
</script>

<template>
  <main class="tran-transfer-container">
    <div class="left_wrap">
      <el-tooltip effect="light" :content="version">
        <section @click="onVersionClick" cursor-pointer id="logo"></section>
      </el-tooltip>

      <el-tooltip
        v-if="onLineUserList.onlineList.length"
        effect="light"
        content="当前加入用户数，感谢使用Tran"
        placement="right"
      >
        <span class="regis_user">
          {{ onLineUserList.onlineList.length }}
        </span>
      </el-tooltip>
    </div>

    <template v-if="!reactive_data.showPage">
      <ShowUser @exit="onExit" />
    </template>

    <template v-if="!reactive_data.showPage">
      <div class="tip">选择发送给用户</div>
      <online-user />
      <div class="tip">选择/拖拽文件
      </div>
      <TranUpload />

      <section v-show="isTableShow">
        <div class="tip">
          发送给我的文件列表
          <section class="btn_control_area">
            <el-button text @click="onTableRefresh" :icon="Refresh"></el-button>
          </section>
        </div>
        <ProfileFileList ref="tableRef" />
      </section>

      <section v-show="isTableShow">
        <div class="tip">
          我发送的文件列表
          <section class="btn_control_area">
            <el-button text @click="onTableRefreshProfile" :icon="Refresh"></el-button>
          </section>
        </div>
        <ProfileSentOtherUserList ref="profileSentRef" />
      </section>
    </template>

    <!--    <el-backtop :right="100" :bottom="200" target=".tran-transfer-container" :visibility-height="1"/>-->
  </main>

  <tran-diaglog title="版本查看" v-model:pop-control="versionPop">
    <template #default>
      <div v-if="userAuth.includes('addVersion')" class="version_control_group">
        <el-button @click="onAddVersion" size="small">添加版本</el-button>
        <el-button size="small" @click="fetchGetVersionList" :icon="Refresh"></el-button>
      </div>
      <div class="version_list" v-if="!version_list_cut">
        <template :key="index" v-for="(item, index) in versionList">
          <div class="version_wrap">
            <div class="version_tit" :class="[!index ? 'text-color-gold!' : '']">
              {{ item.versionTitle }}
            </div>
            <div class="version_list_item" :key="idx" v-for="(it, idx) in item.versionList">
              <el-tag :type="getTagType(it.type)">{{ it.type }}</el-tag>
              <span :style="{
                color: 'var(' + getColor(it.type) + ')'
              }">{{ it.content }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="version_form" v-else>
        <el-form :model="versionForm" label-width="auto">
          <el-form-item label="版本号" prop="versionTitle">
            <el-input v-model="versionForm.versionTitle"></el-input>
          </el-form-item>
          <el-form-item label="版本描述">
            <el-select w-50 mb-5 v-model="versionForm.versionType">
              <el-option
                :key="index"
                v-for="(item, index) in versionOption"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-input v-model="versionForm.versionDesc">
              <template #append>
                <el-icon @click="onAddVersionItem"><CirclePlus /></el-icon>
              </template>
            </el-input>

            <div class="view_version_wrap">
              <div
                class="version_item_wrap"
                :key="index"
                v-for="(item, index) in versionForm.versionContent"
              >
                <div class="item">
                  <el-tag :type="getTagType(item.type)">{{ item.type }}</el-tag>
                  <span> {{ item.content }} </span>
                  <el-icon cursor-pointer @click="onDeleteItem(item)"><Delete /></el-icon>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="block" text-right w-full>
              <el-button size="small" text @click="onAddVersionSubmit" type="primary"
                >提交</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </tran-diaglog>
</template>

<style scoped lang="scss">
@use '@/assets/version.scss';
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

.tran-transfer-container {
  height: 100%;
  //overflow: auto;
  .tip {
    margin: 10px 0;
    @include flexStyle(center);
  }

  .left_wrap {
    display: flex;
  }
}
</style>
