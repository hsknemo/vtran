<script setup lang="ts">
import MaterialSymbolsLightDocumentSearchOutline from '~icons/material-symbols-light/document-search-outline'
import MageMessageDotsRound from '~icons/mage/message-dots-round'
import { onMounted, reactive, ref } from 'vue'
import {
  reactiveIssue,
  useIssueCommentsAddService,
  useIssueCommentsFindService,
  useIssueFindService,
  useIssueListService,
} from '@/service/issue/issueService.ts'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
import type {
  IssueFindItem,
  IssueItem,
  CommentsData,
  commentsItem,
  IssueReplyType,
} from '@/service/issue/issueServiceDataType'
import ReplyComments from '@/views/bugs/compo/ReplyComments.vue'
import { useGetUserNameFromUserId } from '@/hook/issue.ts'
import TimeDiff from '@/views/bugs/compo/TimeDiff.vue'
const showComments = ref({
  show: false,
})
const comment_drawer = ref<boolean>(false)
const comment = ref('')
const drawerData = reactive({
  data: {} as IssueFindItem,
  commentsData: {} as CommentsData,
})
const handleClose = () => {
  comment_drawer.value = false
}

const onReplySuccess = async () => {
  const commentsData = await useIssueCommentsFindService(drawerData.commentsData.issueId)
  drawerData.commentsData = commentsData
}

const onOpenDrawer = async (row: IssueItem) => {
  comment_drawer.value = true
  const d = await useIssueFindService(row.id)
  drawerData.data = d
  const commentsData = await useIssueCommentsFindService(row.id)
  drawerData.commentsData = commentsData
}

const getImgUrl = (url: string) => {
  return import.meta.env.VITE_API_URL + `/issue/` + drawerData.data.issueCreateUser + '/' + url
}

const onSendComments = async () => {
  const status = await useIssueCommentsAddService({
    issueId: drawerData.data.id,
    content: comment.value,
  })
  if (status) {
    comment.value = ''
  }
}
const replyProps = ref<IssueReplyType>({
  id: '',
  content: '',
  issueId: '',
  replyId: '',
  replyUser: '',
})
const onReply = (row: commentsItem, replyId:string = '', replyUser:string = '') => {
  showComments.value = {
    show: true,
  }
  replyProps.value.issueId = drawerData.commentsData.issueId
  replyProps.value.id = row.id
  replyProps.value.replyId = replyId
  replyProps.value.replyUser = replyUser
}


onMounted(() => {
  useIssueListService()
})
</script>

<template>
  <div class="issue_user_comments">
    <template v-if="reactiveIssue.list.length">
      <div
        class="issue_block"
        :style="{
          '--item-color': 'var(--el-color-danger)',
        }"
        :key="item"
        v-for="item in reactiveIssue.list"
      >
        <div class="top">
          <div class="type danger">
            <el-tag type="danger">{{ item.issueType }}</el-tag>
          </div>
          <div class="desc">{{ item.content }}</div>
        </div>
        <div class="botm">
          <el-tooltip effect="light" content="查看内容">
            <MaterialSymbolsLightDocumentSearchOutline text-xl @click="onOpenDrawer(item)" />
          </el-tooltip>
          <div class="time">{{ item.insertTime }}</div>
        </div>
      </div>
    </template>

    <template v-else>
      <el-empty></el-empty>
    </template>
  </div>

  <el-drawer
    class="note_drawer"
    header-class="node_drawer_header"
    size="70%"
    :modal="false"
    modal-penetrable
    v-model="comment_drawer"
    title="内容"
    :before-close="handleClose"
  >
    <section class="top_block">
      <div class="tit">问题类型</div>
    </section>
    <el-tag m-y-2>{{ drawerData.data.issueType }}</el-tag>
    <section class="top_block">
      <div class="tit">佐证</div>
      <ul>
        <li>标题</li>
      </ul>
      <div class="issue_titl">
        {{ drawerData.data.content }}
      </div>

      <ul>
        <li>正文内容</li>
      </ul>

      <acticle class="markdown_msg" v-if="drawerData.data.markdownStr">
        <MarkdownMsg v-model:value="drawerData.data.markdownStr"></MarkdownMsg>
      </acticle>

      <ul>
        <li>附件</li>
      </ul>

      <div class="media_body">
        <div class="img_item" v-for="item in drawerData.data.uploadImg" :key="item">
          <el-image
            :src="getImgUrl(item)"
            fit="cover"
            :preview-src-list="[getImgUrl(item)]"
            style="width: 100%; height: 100%"
          >
          </el-image>
        </div>
      </div>
    </section>
    <section class="top_block">
      <div class="tit">评论</div>
      <el-input :rows="3" resize="none" v-model="comment" type="textarea"> </el-input>

      <div class="btn_group" mt-2 w-full="" flex justify-end>
        <el-button @click="onSendComments" size="small">评论</el-button>
      </div>

      <div class="msg_item" :key="index" v-for="(item, index) in drawerData.commentsData.comments">
        <div class="msg_title">{{ useGetUserNameFromUserId(item.fromUser) }}</div>
        <p>{{ item.content }}</p>
        <TimeDiff
          class="time"
          :time="item.insertTime"
        />
        <div @click="onReply(item, '', item.fromUser)" class="reply" flex items-center cursor-pointer>
          <MageMessageDotsRound mr-1 />
          回复
        </div>
        <div class="reply_content"
             :key="idx"
             v-for='(it, idx) in item.reply'>
          <div class="reply_item">
            <div class="msg_title">{{ useGetUserNameFromUserId(it.fromUser) }} 回复 {{ useGetUserNameFromUserId(it.replyUser) }}</div>
            <p>{{ it.content }}</p>

            <TimeDiff
              class="time"
              :time="it.insertTime"
            />

            <div @click="onReply(item, it.id,  it.fromUser)" class="reply" flex items-center cursor-pointer>
              <MageMessageDotsRound mr-1 />
              回复
            </div>

          </div>
        </div>
      </div>

      <!--      <div class="msg_item" p-l>-->
      <!--        <div class="msg_title">xxx说</div>-->
      <!--        <p>-->
      <!--          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet culpa, dolor error iusto-->
      <!--          non quia tempora. Aliquam eligendi facilis laboriosam nam nulla numquam perspiciatis-->
      <!--          possimus quae, qui recusandae, totam vero.-->
      <!--        </p>-->
      <!--      </div>-->
    </section>

    <ReplyComments
      @reply-success="onReplySuccess"
      @drawer-close="showComments.show = false"
      :reply-props="replyProps"
      v-model:drawer="showComments"
    />
  </el-drawer>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.issue_user_comments {
  border-radius: var(--tran-round);
  background-color: var(--tran-dark);
  padding: 10px;
  max-height: 700px;
  overflow: auto;
  .issue_block {
    border-bottom: 1px solid #404040;
    margin-bottom: 10px;
  }
  .top {
    @include flexStyle(center);
    .type {
      margin-right: 10px;
      @apply rounded px-2 py-1;
      font-size: 12px;
      font-weight: bold;
    }
  }
  .botm {
    padding: 5px;
    @include flexStyle(center);
    justify-content: flex-end;
    svg {
      font-size: 12px;
      cursor: pointer;
      margin-right: 10px;
    }
    .time {
      font-size: 12px;
      color: gray;
    }
  }
}

.top_block {
  .tit {
    margin: 5px 0;
    line-height: 30px;
    padding-left: 10px;
    border-left: 4px solid greenyellow;
    background-color: rgba(58, 58, 58, 0.1);
    border-radius: calc(var(--tran-round) - 3px);
  }

  ul {
    padding-left: 1rem;
  }
}

.markdown_msg {
  max-height: 400px;
  overflow: auto;
}

.media_body {
  @include flexStyle();
  flex-wrap: wrap;
  .img_item {
    margin: 5px;
  }
  :deep {
    img {
      max-width: 150px;
      max-height: 150px;
      object-fit: scale-down;
    }
  }
}

.msg_item {
  max-height: 300px;
  overflow: auto;
  padding: 5px;
  margin-top: 5px;
  border-radius: var(--tran-round);
  background-color: var(--tran-dark);

  .msg_title {
    margin-bottom: 5px;
  }

  p {
    max-height: 100px;
    overflow: auto;
    padding: 10px 5px;
    background-color: #353535;
  }
  &:after {
    margin-top: 10px;
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #404040;
  }
  .time {
    color: #717171;
    font-size: 12px;
    text-align: right;
    :deep {
      span {
        position: relative;
        top:1px;
      }
    }
  }

  &:hover {
    .reply {
      opacity: 1;
    }
  }

  .reply {
    transition: opacity .3s ease;
    opacity: 0;
  }
}

.reply_content {
  margin: 5px 0;
  padding-left: 10px;
}
</style>
