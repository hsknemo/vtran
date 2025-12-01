<script setup lang="ts">
import { useIssueCommentsReplyService } from '@/service/issue/issueService.ts'
import type { IssueReplyType } from '@/service/issue/issueServiceDataType'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['drawer-close', 'reply-success'])
const reply = ref('')
const props = defineProps({
  drawer: {
    type: Object,
    default: () => ({
      show: false
    })
  },
  replyProps: {
    type: Object,
    default: () => ({} as IssueReplyType)
  }
})

const onReply = async () => {
  const prop = Object.assign({} , props.replyProps, {
    content: reply.value
  }) as IssueReplyType
  const status = await useIssueCommentsReplyService(prop)
  if (status) {
    ElMessage.success('回复成功')
    emit('drawer-close')
    emit('reply-success')
  }
}
</script>

<template>
  <el-drawer v-model="props.drawer.show"
             direction="btt" resizable
  >
    <div class="reply_comments_wrap" mt-1>
      <el-input
        size="small"
        v-model="reply"
        placeholder="请输入回复内容"
        type="textarea">

      </el-input>
      <el-button mt-1 size="small"
                 @click="onReply"
      >
        回复Ta
      </el-button>
    </div>
  </el-drawer>


</template>

<style scoped lang="scss">

</style>
