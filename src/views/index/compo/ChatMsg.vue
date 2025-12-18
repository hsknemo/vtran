<script setup lang="ts">
import ChatUtilsBar from '@/views/index/compo/ChatUtilsBar.vue'
import { Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const emits = defineEmits<(e: 'send-message', emoji: string) => void>()
const userMsg = ref<string>('')

const onEmojiTextSelect = (emoji: string) => {
  userMsg.value += emoji
}

const onSend = () => {
  if (userMsg.value === '') return ElMessage.warning('输入内容为空')
  emits('send-message', userMsg)

  userMsg.value = ''
}
const collectKey = ref<Set<string>>(new Set())
/*
 * 监听组合键
 */
const onKeydown = (...args: any[]) => {
  const code = args[0].code
  if (['MetaLeft', 'MetaRight', 'ControlLeft', 'ControlRight', 'Enter'].includes(code)) {
    collectKey.value.add(code)

    setTimeout(() => {
      collectKey.value.clear()
    }, 500)
  }

  const arr = Array.from(collectKey.value)
  if (arr[0] === 'Enter') {
    collectKey.value.clear()
  }
  if (collectKey.value.size === 2) {
    const str = arr.join('-')
    if (str.endsWith('Enter')) {
      onSend()
    }
    collectKey.value.clear()
  }
}

const onBlur = () => {
  collectKey.value.clear()
}
</script>

<template>
  <footer class="tran_chat_footer">
    <section class="footer_item none_flex_end">
      <ChatUtilsBar @emoji-text-select="onEmojiTextSelect" />
    </section>
    <section class="footer_item input_area">
      <el-input
        @blur="onBlur"
        @keydown="onKeydown"
        :autosize="{
          maxRows: 2,
        }"
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
