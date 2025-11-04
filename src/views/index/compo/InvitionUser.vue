<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onLineUserList } from '@/views/index/store/store.ts'
import { Plus } from '@element-plus/icons-vue'
import { addUserToGroup } from '@/api/group/group.ts'
import { face_smile_to_life } from '@/utils/happyiness.ts'
const emits = defineEmits(['refresh-current-group'])
const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  hasGroupUser: {
    type: Array,
    default: () => ([])
  }
})

/**
 * 邀人入组
 * @param item
 */
const onInvUser = async (item:never) => {
  try {
    await addUserToGroup({
      groupId: props.groupId,
      userId: item.id
    })
    emits('refresh-current-group', props.groupId)
    ElMessage.success('已邀请用户加入群组')
  } catch (e) {
    ElMessage.error('邀请用户加入群组失败')
  }
}

const onSmileToLife = () => {
  face_smile_to_life()
}

</script>

<template>
  <div class="tran_invitation_user_panel">
    <template
      v-for="(item, index) in onLineUserList.onlineList"
    >
      <div class="invitation_item"
           :key="index"
           v-if="!hasGroupUser.includes(item.id)"
      >
        <span class="user_name">{{ item.username }}</span>
        <el-button @click="onInvUser(item)" :icon="Plus"></el-button>
      </div>
    </template>

    <div
      @click="onSmileToLife"
      class="no_user_inv"
      v-if="hasGroupUser.length - 1 === onLineUserList.onlineList.length">
      🐮 yo~ 人都被抢光了！
    </div>
  </div>
</template>

<style scoped lang="scss">

@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
@mixin invitation_item() {
  .invitation_item {
    margin-bottom: 10px;
    @include flexStyle(center, space-around);
    border-radius: 5px;
    padding: 10px;
    background-color: #1d1d1d;
    .user_name {
      flex: 1;
    }
  }
}

@mixin no_user_inv {
  .no_user_inv {
    font-weight: bold;
    font-size: 24px;
  }
}
.tran_invitation_user_panel {
  @include invitation_item();
  max-height: 400px;
  overflow: auto;

  @include no_user_inv;
}
</style>
