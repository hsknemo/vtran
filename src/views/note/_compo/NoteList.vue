<script setup lang="ts">

import { getNoteList } from '@/api/note/note.ts'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
import { ref } from 'vue'

let noteLoading = ref(false)
const mdLoading = ref(false)
const note_drawer = ref(false)
const direction = ref('rtl')
const mdContent = ref('')
const handleClose = (done: () => void) => {
  done()
}

let noteList = ref([])

const getNoteListFetch = async () => {
  try {
    noteLoading.value = true
    let data = await getNoteList()
    noteList.value = data.data
  } catch (e) {
    ElMessage.error('获取笔记列表失败')
  } finally {
    noteLoading.value = false
  }
}

interface NoteItem {
  id: string,
  name: string,
  desc: string,
  markColor: string,
  updateTime: string,
  createTime: string,
  contentUrl: string,
}
const getNote = async (item:NoteItem) => {
  mdContent.value = ''
  note_drawer.value = true
  await getStreamFileContent(item.contentUrl)
}

const getStreamFileContent = async (fileId: string) => {
  try {
    mdLoading.value = true
    const fileName = fileId
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/note/one', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('Auth')
      },
      body: JSON.stringify({
        fileName,
      })
    } as RequestInit)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP错误: ${response.status}`)
    }

    // 检查响应是否可流式处理
    if (!response.body) {
      throw new Error('浏览器不支持流式响应')
    }

    // 获取可读流并解码为文本
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    // 循环读取流数据
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        mdLoading.value = false
        console.log('流传输完成')
        break
      }

      // 解码二进制数据为文本并累加
      const chunk = decoder.decode(value, { stream: true })
      mdContent.value += chunk
    }

  } catch (e) {
    noteLoading.value = false
    ElMessage.error('获取文件内容失败')
  }
}

onMounted(() => {
  getNoteListFetch()
})
</script>

<template>
<div class="note_list" v-loading="noteLoading">
  <div class="note_list_item"
       @click="getNote(item)"
       :key="index"
       v-for="(item, index) in noteList">
    <div class="top">
      <div class="note_title">{{ item.name }}</div>
      <el-icon><Close /></el-icon>
    </div>
    <div class="mid">
      {{ item.desc }}
    </div>
    <footer class="note-footer note_time update_time">
      <div class="rec" :style="{
        '--rec-color': item.markColor,
      }"></div>
      <span>最近更新于：{{ item.updateTime }}</span>
    </footer>
  </div>
</div>

  <el-drawer
    modal-class="note_drawer"
    header-class="node_drawer_header"
    size="70%"
    :modal="false"
    modal-penetrable
    v-model="note_drawer"
    title="便签-有了记忆更要有载体"
    :direction="direction"
    :before-close="handleClose"
  >
    <MarkdownMsg v-loading="noteLoading" :value="mdContent" />
    <div class="tran_tip">giao!</div>
  </el-drawer>

  <div class="tran_tip">释放大脑计划☺️</div>
</template>

<style scoped lang="scss">

@mixin flexStyle($align:'center', $justContent:'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}

@mixin note_body {
  .top {
    @include flexStyle(center, space-between);
    .note_title {
      font-weight: bold;
    }
    .el-icon {
      color: #fc3333;
    }
  }

  .note_time {
    font-size: 12px;
    color: #696d69;
  }

  .mid {
    height: calc(100% - 50px);
    //background-color: red;
    overflow: auto;
  }

  .note-footer {
    margin-top: 5px;
    text-align: right;
    @include flexStyle(center, space-between);

    .rec {
      width: 10px;
      height: 10px;
      background-color: var(--rec-color);
      border-radius: 100%;
    }
  }
}

@mixin note_list_item() {
  .note_list_item {
    width: 260px;
    height: 200px;
    background-color: #1d1d1d;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: 10px;

    @include note_body()
  }
}


.note_list {
  @include flexStyle();
  flex-wrap: wrap;
  @include note_list_item();
}

.tran_tip {
  margin-top: 10px;
  user-select: none;
  color: #696d69;
  font-size: 12px;
  width: 100%;
  text-align: center;
}


.tran_markdown_show_area {
  height: calc(100% - 100px);
  width: 100%;
  overflow: auto;
}


</style>
<style
  lang="scss"
>
.node_drawer_header {
  .el-drawer__title {
    font-size: 14px !important;
    color: #696d69 !important;
  }
}
</style>
