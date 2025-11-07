<!--
  聊天工具栏组件
-->
<script setup lang="ts">
import { Scissor } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { onUtilsFunc } from '@/views/index/service/ChatUtilsService/chatUtils.ts'
import Emoji from '@/views/index/pageComponent/Emoji.vue'
const emit = defineEmits(['emoji-text-select'])

const chatUtilsBarReactive = reactive({
  iconList: [
    {
      icon: Scissor,
      text: '截图',
      type: 'el-icon',
    },
    {
      icon: Emoji,
      text: '表情',
      type: 'el-icon',
    },
    {
      icon: 'Code',
      text: '代码',
      type: 'custom-text',
    },
  ],
})
</script>

<template>
  <div class="tran_chat_utils_bar">
    <template :key="index" v-for="(item, index) in chatUtilsBarReactive.iconList">
      <el-tooltip :content="item.text" effect="light" placement="top">
        <div class="control_item">
          <component
            @emoji-text-select="val => emit('emoji-text-select', val)"
            @click="onUtilsFunc(item.text)"
            v-if="item.type === 'el-icon'"
            :is="item.icon"
          ></component>
          <span @click="onUtilsFunc(item.text)" class="custom_icon_text" v-else>{{
            item.icon
          }}</span>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
@mixin custom_icon_text {
  .custom_icon_text {
    display: inline-block;
    width: fit-content;
    user-select: none;
    font-style: normal;
    cursor: pointer;
  }
}

@mixin control_item {
  .control_item {
    width: fit-content;
    height: 20px;
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
.tran_chat_utils_bar {
  @include flexStyle(center);
  margin: 10px 0;

  background-color: #1d1d1d;
  width: 100%;
  border-radius: 5px;

  @include control_item();

  svg {
    width: 1em;
    height: 1em;
    cursor: pointer;
  }

  :deep {
    @include custom_icon_text();
  }
}
</style>
