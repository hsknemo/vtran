<script setup lang="ts">
import ChatUtilsBar from '@/views/index/compo/ChatUtilsBar.vue'
import { Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ShortcutManager } from '@/utils/hotKey.ts'
const emits = defineEmits<(e: 'send-message', emoji: string) => void>()
const userMsg = ref<string>('')
const inputMsg = ref<HTMLInputElement>()
const onEmojiTextSelect = (emoji: string) => {
  userMsg.value += emoji
}
const isFocus = ref<boolean>(false)
const onSend = () => {
  if (userMsg.value === '') return ElMessage.warning('输入内容为空')
  emits('send-message', userMsg)

  userMsg.value = ''
}
/*
 * 监听组合键
 */
ShortcutManager.addShortcut({
  key: 'Enter',
  ctrl: true,
  callback: () => {
    if (isFocus.value) onSend()
  },
})

ShortcutManager.addShortcut({
  key: 'Enter',
  meta: true,
  callback: () => {
    if (isFocus.value) onSend()
  },
})

</script>

<template>
  <footer class="tran_chat_footer">
    <section class="footer_item none_flex_end">
      <ChatUtilsBar @emoji-text-select="onEmojiTextSelect" />
    </section>
    <section class="footer_item input_area">
      <!--        @keydown="onKeydown"-->
      <el-input
        ref="inputMsg"
        @blur="isFocus = false"
        :autosize="{
          maxRows: 2,
        }"
        @focus="isFocus = true"
        :rows="1"
        resize="none"
        id="tran_input"
        type="textarea"
        v-model="userMsg"
      ></el-input>
      <div class="input_botm">
        <el-button @click="onSend" :icon="Promotion">(Ctrl | Command) + Enter</el-button>
      </div>
    </section>
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/chat';
</style>
