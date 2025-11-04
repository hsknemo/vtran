<script setup lang="ts">
import { onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { onlineUser } from '@/api/user/user.ts'
import { ElMessage } from 'element-plus'
import { emitter } from '@/event/eventBus.ts'
import { onLineUserList } from '@/views/index/store/store.ts'
import type { InterfaceOnlineUser } from '@/views/index/store/type/store.ts'



const onRefresh = async () => {
  try {
    const res: InterfaceOnlineUser[] = await onlineUser({})
    onLineUserList.onlineList = res.data || []
  } catch (e) {
    ElMessage.error(e.msg)
  }
}

const loopFetch = () => {
  window._user_online_timeout = setTimeout(() => {
    onRefresh()
    loopFetch()
    clearTimeout(window._user_online_timeout)
  }, 5000)
}

onMounted((_) => {
  onRefresh()
  emitter.on('refresh-user', onRefresh)
  loopFetch()
})


</script>

<template>
  <section class="v_tran_select">
    <el-select placeholder="请选择指定发送用户" v-model="onLineUserList.curSelectUser">
      <el-option
        :key="index"
        v-for="(item, index) in onLineUserList.onlineList"
        :label="item.username"
        :value="item.id"
      ></el-option>
    </el-select>

    <el-button @click="onRefresh" :icon="Refresh"> </el-button>
  </section>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.v_tran_select {
  width: 400px;
  @include flexStyle(center);
  .el-select {
    margin-right: 10px;
  }
}
</style>
