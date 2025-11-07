<!--
  聊天工具栏组件
-->
<script setup lang="ts">
import { Scissor } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { onUtilsFunc } from '@/views/index/service/ChatUtilsService/chatUtils.ts'
import Emoji from '@/views/index/pageComponent/Emoji.vue'
const emit = defineEmits(['emoji-text-select'])
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const startDriver = () => {
  const isStartDriver = localStorage.getItem('startDriver');
  if (isStartDriver == 'false') {
    return
  }
  const driverObj = new driver({
    prevBtnText: "上一步",
    nextBtnText: "下一步",
    doneBtnText: "我知道了",
    closeBtnText: "关闭",
    onCloseClick: (ele: any) => {
      localStorage.setItem('startDriver', 'false');
    },
  });

  const steps = [
    {
      element: "#tran_emoji",
      popover: {
        title: "表情功能---同样支持群聊哟~",
        description: "点击此处可选择表情发送给对方",
      }
    },
    {
      element: "#tran_code",
      popover: {
        title: "代码功能---同样支持群聊哟~",
        description: "可以编写代码进行文本发送",
      }
    },
    {
      element: "#tran_input",
      popover: {
        title: "输入框升级---同样支持群聊哟~",
        description: "支持发送markdown 语法，取消了回车键事件，暂时使用鼠标点击发送消息",
      }
    }
  ]

  driverObj.setSteps(steps);
  driverObj.drive();
}
const props = defineProps({
  isGroup: {
    type: Boolean,
    default: false,
  }
})

const chatUtilsBarReactive = reactive({
  iconList: [
    {
      id: 'tran_screenshot',
      icon: Scissor,
      text: '截图',
      type: 'el-icon',
    },
    {
      id: 'tran_emoji',
      icon: Emoji,
      text: '表情',
      type: 'el-icon',
    },
    {
      id: 'tran_code',
      icon: 'Code',
      text: '代码',
      type: 'custom-text',
    },
  ],
})

onMounted(() => {
  startDriver()
})
</script>

<template>
  <div class="tran_chat_utils_bar">
    <template :key="index" v-for="(item, index) in chatUtilsBarReactive.iconList">
      <el-tooltip :content="item.text" effect="light" placement="top">
        <div class="control_item">
          <component
            :id="item.id"
            @emoji-text-select="val => emit('emoji-text-select', val)"
            @click="onUtilsFunc(item.text, props.isGroup)"
            v-if="item.type === 'el-icon'"
            :is="item.icon"
          ></component>
          <span
            :id="item.id"
            @click="onUtilsFunc(item.text, props.isGroup)" class="custom_icon_text" v-else>{{
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
