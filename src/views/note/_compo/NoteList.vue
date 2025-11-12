<script setup lang="ts">
import { deleteNoteFile, getNoteList, updateNoteList } from '@/api/note/note.ts'
import { ElMessage } from 'element-plus'
import { Check, Close, Edit } from '@element-plus/icons-vue'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
import { ref } from 'vue'
import MonacoEditor from '@/views/index/pageComponent/MonacoEditor.vue'
import { delay } from '@/utils/sleep.ts'
import moment from 'moment'
const noteLoading = ref(false)
const mdLoading = ref(false)
const note_drawer = ref(false)
const direction = ref('rtl')
const mdContent = ref('')
const lastRes = ref({})
const handleClose = (done: () => void) => {
  done()
}

const noteList = ref([])

const getNoteListFetch = async () => {
  try {
    noteLoading.value = true
    const data = await getNoteList()
    noteList.value = data.data
    const yearList = {}
    const yearSet = new Set()
    data.data.forEach(item => {
      yearSet.add(moment(item.createTime).format('YYYY'))
    })
    const arr = Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a))
    arr.forEach(item => {
      yearList[item] = []
    })

    data.data.forEach(item => {
      const y = moment(item.createTime).format('YYYY')
      if (yearList[y]) {
        yearList[y].push(item)
      }
    })

    console.log(yearList)
    lastRes.value = yearList
  } catch (e) {
    ElMessage.error('获取笔记列表失败')
  } finally {
    noteLoading.value = false
  }
}
interface NoteItem {
  id: string
  name: string
  desc: string
  markColor: string
  updateTime: string
  createTime: string
  contentUrl: string
}

const curSelectRow = ref({} as NoteItem)
const drawerEdit = ref(false)
const monoEditorRef = ref()

const getNote = async (item: NoteItem) => {
  drawerEdit.value = false
  mdContent.value = ''
  note_drawer.value = true
  curSelectRow.value = item
  await getStreamFileContent(item.contentUrl)
}

const onDelete = async (item: NoteItem) => {
  try {
    await deleteNoteFile({
      id: item.id,
      fileName: item.contentUrl,
    })
    ElMessage.success('删除成功')
  } catch (e) {
    ElMessage.error('删除失败')
  } finally {
    getNoteListFetch()
  }
}

/**
 *
 * @description 获取文件内容
 * @param { string } fileId 文件名称
 */
const getStreamFileContent = async (fileId: string) => {
  try {
    mdContent.value = ''
    mdLoading.value = true
    const fileName = fileId
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/note/one', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Auth'),
      },
      body: JSON.stringify({
        fileName,
      }),
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

const onEditMardown = () => {
  drawerEdit.value = !drawerEdit.value
}

const onSubmitEdit = async () => {
  const v = monoEditorRef.value.getValue()

  const id = curSelectRow.value.id
  const fileName = curSelectRow.value.contentUrl
  try {
    await updateNoteList({
      id,
      fileName,
      content: v,
    })
    ElMessage.success('更新成功')
    drawerEdit.value = false

    await delay(1000)
    await getStreamFileContent(curSelectRow.value.contentUrl)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  getNoteListFetch()
})
</script>

<template>
  <div class="note_container" v-loading="noteLoading">
    <template v-for="(it, index) in lastRes">
      <div class="tipShow">{{index}}</div>
      <div class="note_list" >
        <div
          class="note_list_item"
          @click.stop="getNote(item)"
          :key="idx"
          v-for="(item, idx) in it"
        >
          <div class="top">
            <div class="note_title">{{ item.name }}</div>
            <el-icon @click.stop="onDelete(item)"><Close /></el-icon>
          </div>
          <div class="mid">
            {{ item.desc }}
          </div>
          <footer class="note-footer note_time update_time">
            <div
              class="rec"
              :style="{
            '--rec-color': item.markColor,
          }"
            ></div>
            <span>最近更新于：{{ item.updateTime }}</span>
          </footer>
        </div>
      </div>
    </template>

  </div>



  <el-drawer
    class="note_drawer"
    header-class="node_drawer_header"
    size="70%"
    :modal="false"
    modal-penetrable
    v-model="note_drawer"
    title="便签-有了记忆更要有载体"
    :direction="direction"
    :before-close="handleClose"
  >
    <div class="btn_group">
      <el-icon @click="onEditMardown"><Edit /></el-icon>
    </div>
    <MarkdownMsg v-if="!drawerEdit" v-loading="noteLoading" :value="mdContent" />
    <monaco-editor
      v-else
      v-model:value="mdContent"
      ref="monoEditorRef"
      :isNeedDefaultLang="false"
    />
    <div v-if="drawerEdit" class="control_btn_group">
      <el-icon @click="onSubmitEdit"><Check /></el-icon>
    </div>
    <div class="tran_tip">giao!</div>
  </el-drawer>

  <div class="tran_tip">释放大脑计划☺️</div>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
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

    @include note_body();
  }
}

@mixin tipShow() {
  position: relative;
  font-size: 40px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #1d1d1d;
  width: fit-content;
  padding: 5px 10px;
  margin-bottom: 10px;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #1d1d1d;
  }
}
.tipShow {
  @include tipShow();
}

.note_container {
  margin-top: 10px;
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
<style lang="scss">
.node_drawer_header {
  .el-drawer__title {
    font-size: 14px !important;
    color: #696d69 !important;
  }
}

.note_drawer {
  .btn_group {
    .el-icon {
      cursor: pointer;
    }
  }
}
</style>
