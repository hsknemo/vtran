<script setup lang="ts">
import MageMessageDots from '~icons/mage/message-dots'
import MageMessageDotsRound from '~icons/mage/message-dots-round'
const comment_drawer = ref<boolean>(true)

const handleClose = () => {
  comment_drawer.value = false
}

const onOpenDrawer = (row) => {
  comment_drawer.value = true
}
</script>

<template>
  <div class="issue_user_comments">
    <div class="issue_block" :key="item" v-for="item in 50">
      <div class="top">
        <div class="type danger">BUG</div>
        <div class="desc">描述描述</div>
      </div>
      <div class="botm">
        <MageMessageDots @click="onOpenDrawer(item)" />
        <div class="time">2021-09-09 10:10:10</div>
      </div>
    </div>
  </div>


  <el-drawer
    class="note_drawer"
    header-class="node_drawer_header"
    size="70%"
    :modal="false"
    modal-penetrable
    v-model="comment_drawer"
    title="评论"
    :before-close="handleClose"
  >
    <section class="msg_block">
      <div class="msg_item">
        <div class="msg_title">
          xxx说：
        </div>
        <p>223323232323233</p>
        <MageMessageDotsRound />
      </div>

      <div class="msg_item" p-l>
        <div class="msg_title">
          xxx说：
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet culpa, dolor error iusto non quia tempora. Aliquam eligendi facilis laboriosam nam nulla numquam perspiciatis possimus quae, qui recusandae, totam vero.</p>
      </div>

    </section>
  </el-drawer>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
.issue_user_comments {
  padding: 0 10px;
  max-height: 700px;
  overflow: auto;
  .issue_block {
    margin-bottom: 10px;
  }
 .top {
   @include flexStyle(center);
   .type {
     margin-right: 10px;
     @apply rounded px-2 py-1;
     font-size: 12px;
     font-weight: bold;
     &.danger {
       color: rgb(255 151 151);
       background-color: rgba(255, 98, 98, .56);
     }
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
</style>
