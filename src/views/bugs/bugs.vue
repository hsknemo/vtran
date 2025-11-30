<script setup lang="ts">
import MaterialSymbolsLightMarkdownPaste from '~icons/material-symbols-light/markdown-paste'
import MageImage from '~icons/mage/image'
import MageNotificationBellPending from '~icons/mage/notification-bell-pending'

import AuthorTip from '@/views/bugs/compo/AuthorTip.vue'
import UserComments from '@/views/bugs/compo/UserComments.vue'
import MonacoEditor from '@/views/index/pageComponent/MonacoEditor.vue'
import TranDiaglog from '@/components/TranDiaglog.vue'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
const editMarkDia = ref({
  show: true
})

const onSureMarkdownDia = () => {
  editMarkDia.value = false
}
const onOpenMarkdown = () => {
  editMarkDia.value = true
}

const editingText = ref('')

const onEditMarkdown = (val:string) => {
  editingText.value = val
}
const showTip = ref<boolean>(false)

</script>

<template>
  <div w-full>
    <section class="top_menu_bar">
      <el-tooltip content="编写markdown" effect="light" placement="bottom">
        <MaterialSymbolsLightMarkdownPaste
          @click="onOpenMarkdown"
          cursor-pointer class="hover-color-amber" />
      </el-tooltip>

      <el-tooltip content="上传图片" effect="light" placement="bottom">
        <MageImage cursor-pointer class="hover-color-amber" />
      </el-tooltip>

      <el-tooltip content="作者提示" effect="light" placement="bottom" >
        <MageNotificationBellPending
          @click="showTip=!showTip"
          cursor-pointer
          class="hover-color-amber" />
      </el-tooltip>

    </section>
    <section flex flex-wrap>
      <textarea resize="none" class="text_area_style" placeholder="请输入问题"></textarea>
      <section flex justify-end w-full="">
        <div class="btn_style">发布</div>
      </section>
    </section>

    <AuthorTip v-if="showTip"/>

    <UserComments />

    <TranDiaglog
      title="编辑markdown"
      v-model="editMarkDia"
    >
      <div w-full h-122>
        <monaco-editor
          @mardown-is-editing="onEditMarkdown"
          ref="monoEditorRef"
          :isNeedDefaultLang="false"
        ></monaco-editor>
        <!--      <MarkdownMsg v-model:value="editingText" />-->
      </div>

      <div flex w-full justify-end mt-2>
        <el-button
          size="small"
          type="primary" @click="onSureMarkdownDia">确定</el-button>
      </div>
    </TranDiaglog>
  </div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
$pageColor: #ffa034;
$pageColor-light: rgba(255, 160, 52, 0.51);

.btn_style {
  @apply w-fit h-10 my-4 flex items-center pxy cursor-pointer rounded;
  transition: all 0.3s linear;
  background-color: $pageColor;
  user-select: none;

  &:hover {
    @apply bg-amber:50;
  }

  &:active {
    @apply bg-amber:90;
  }
}

.top_menu_bar {
  svg {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.text_area_style {
  @apply active:border-none
  focus:border-none
  border="#1d1d1d rounded"
  resize="none"
  h-20
  p-3
  w-full
  rounded;
  outline: 1px solid transparent;
  transition: all 0.3s linear;

  &:focus-visible {
    outline: 1px solid $pageColor;
  }
}

</style>
