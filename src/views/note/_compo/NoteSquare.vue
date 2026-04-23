<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MarkdownMsg from '@/views/index/chatCompo/MarkdownMsg.vue'
import { noteLoading, searchableLastRes, useSearchableNoteListService } from '@/service/note/noteService.ts'

const mdLoading = ref(false)
const note_drawer = ref(false)
const direction = ref('rtl')
const mdContent = ref('')
const currentLoadReqId = ref(0)
const currentLoadController = ref<AbortController | null>(null)
const curSelectRow = ref({} as noteServiceNamespace.NoteItem)

const handleClose = (done: () => void) => {
  done()
}

const getSquareListFetch = async () => {
  await useSearchableNoteListService()
}

const getNote = async (item: noteServiceNamespace.NoteItem) => {
  mdContent.value = ''
  note_drawer.value = true
  curSelectRow.value = item
  await getStreamFileContent(item.contentUrl)
}

const onExportNote = async (item: noteServiceNamespace.NoteItem) => {
  try {
    const fileName = item.contentUrl
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/note/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Auth'),
      },
      body: JSON.stringify({
        fileName,
      }),
    })

    if (!response.ok) {
      throw new Error('导出失败')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = item.name + '.md'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    ElMessage.success('导出成功')
  } catch (e) {
    ElMessage.error('导出失败')
  }
}

const getStreamFileContent = async (fileId: string) => {
  const reqId = ++currentLoadReqId.value
  if (currentLoadController.value) {
    currentLoadController.value.abort()
  }
  const controller = new AbortController()
  currentLoadController.value = controller

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
      signal: controller.signal,
    } as RequestInit)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP错误: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('浏览器不支持流式响应')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (reqId !== currentLoadReqId.value) break
      const chunk = decoder.decode(value, { stream: true })
      mdContent.value += chunk
    }
  } catch (e) {
    if (!(e instanceof DOMException && e.name === 'AbortError')) {
      ElMessage.error('获取便签内容失败')
    }
  } finally {
    if (reqId === currentLoadReqId.value) {
      mdLoading.value = false
      currentLoadController.value = null
    }
  }
}

onUnmounted(() => {
  if (currentLoadController.value) {
    currentLoadController.value.abort()
    currentLoadController.value = null
  }
})

onMounted(() => {
  getSquareListFetch()
})
</script>

<template>
  <div class="note_container" v-loading="noteLoading">
    <template :key="index" v-for="(it, index) in searchableLastRes">
      <div class="note_block" flex>
        <div class="tipShow">{{ index }}</div>
        <div class="note_list">
          <div
            :key="idx"
            class="note_list_item"
            v-for="(item, idx) in it as noteServiceNamespace.NoteItem[]"
            @click.stop="getNote(item)"
          >
            <div class="top">
              <div class="note_title">{{ item.name }}</div>
              <el-icon @click.stop="onExportNote(item)"><Download /></el-icon>
            </div>
            <div class="mid">
              {{ item.desc }}
            </div>
            <div class="shared_by">
              共享人：{{ item.sharedBy || '未知用户' }}
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
    title="便签广场-公开便签"
    :direction="direction"
    :before-close="handleClose"
  >
    <MarkdownMsg v-loading="mdLoading" :value="mdContent" />
    <div class="tran_tip">giao!</div>
  </el-drawer>

  <div class="tran_tip">便签广场仅显示已公开的便签</div>
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
      color: #9a9a9a;
      cursor: pointer;
      transition: color .2s;
      &:hover {
        color: #67c23a;
      }
    }
  }

  .note_time {
    font-size: 12px;
    color: #696d69;
  }

  .mid {
    height: calc(100% - 70px);
    overflow: auto;
  }

  .shared_by {
    margin-top: 6px;
    font-size: 12px;
    color: #8e8e8e;
    text-align: left;
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
  font-size: 22px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #1d1d1d;
  width: fit-content;
  padding: 5px 10px;
  height: 45px;
  margin-right: 10px;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #1d1d1d;
  }
}
.tipShow {
  @include tipShow();
}

.note_block {
  position: relative;
  &:last-child {
    &:before {
      display: none;
    }
  }
  &:before {
    position: absolute;
    content: '';
    left: 39px;
    top: 0;
    bottom: 0;
    width: 1px;
    height: auto;
    background-color: #3f3f3f;
  }
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
</style>
