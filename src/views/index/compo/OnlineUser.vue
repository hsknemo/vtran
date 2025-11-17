<script setup lang="ts">
import { onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { onlineUser } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'
import { onLineUserList } from '@/views/index/store/store.ts'
import type { InterfaceOnlineUser } from '@/views/index/store/type/store.ts'
const emit = defineEmits(['click-user'])

const onRefresh = async (cb: () => void) => {
  try {
    const res: InterfaceOnlineUser[] = await onlineUser({})
    onLineUserList.onlineList = res.data || []
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (typeof cb == 'function') {
      cb && cb()
    }
  } catch (e) {
    ElMessage.error(e)
  }
}

const loopFetch = () => {
  window._user_online_timeout = setTimeout(() => {
    onRefresh(_ => {
      loopFetch()
    })

  }, 5000)
}

onMounted((_) => {
  onRefresh()
  emitter.on('refresh-user', onRefresh)
  loopFetch()
})

// 销毁
onUnmounted(() => {
  clearTimeout(window._user_online_timeout)
})


const onClickUser = (item) => {
  onLineUserList.curSelectUser = item.id
  emit('click-user', onLineUserList.curSelectUser, item)
}
</script>

<template>
  <section class="v_tran_select">
    <div class="tran_send_user_panel">
      <div class="panel_list_item"
           :key="index"
           @click="onClickUser(item)"
           :class="[
             {
              'active': onLineUserList.curSelectUser === item.id
             }
           ]"
           v-for="(item, index) in onLineUserList.onlineList"
      >
        <span :class="[
          {
            isOnline: item.isOnline
          }
        ]">{{ item.username }}</span>
      </div>
    </div>
    <el-button size="small" @click="onRefresh" :icon="Refresh"> </el-button>
  </section>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: center, $justContent:unset) {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@mixin panelItem() {
  .panel_list_item {
    @include flexStyle(center, center);
    width: fit-content;
    height: 50px;
    padding: 5px 15px;
    border-radius: 5px;
    background-color: #1d1d1d;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all .3s ease-out;
    outline: 1px solid transparent;
    &:hover, &.active {
      outline: 1px solid gold;
    }

    span {
      @include flexStyle(center, center);
      &:before {
        margin-right: 10px;
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 5px;
        background-color: #696d69;
      }
    }
    .isOnline {
      &:before {
        background-color: #74f574;
        text-shadow: 0 1px 0 #74f574;
      }
    }
  }
}

@mixin panelList() {
  .tran_send_user_panel {
    @include flexStyle();
    width: 900px;
    flex-wrap: wrap;
    @include panelItem();
  }
}

.v_tran_select {
  width: 400px;
  .el-select {
    margin-right: 10px;
  }

  @include panelList();

}
</style>
