<script setup lang="ts">
import MaterialSymbolsLightMarkdownPaste from '~icons/material-symbols-light/markdown-paste'
import MageImage from '~icons/mage/image'
import MageNotificationBellPending from '~icons/mage/notification-bell-pending'
import MaterialSymbolsLightBookmarkAddOutline from '~icons/material-symbols-light/bookmark-add-outline'
import AuthorTip from '@/views/bugs/compo/AuthorTip.vue'
import UserComments from '@/views/bugs/compo/UserComments.vue'
import MonacoEditor from '@/views/index/pageComponent/MonacoEditor.vue'
import TranDiaglog from '@/components/TranDiaglog.vue'
import { computed, ref } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import ImageList from '@/views/bugs/compo/ImageList.vue'
import { useIssueAddService } from '@/service/issue/issueService'
import type { IssueAddItem } from '@/service/issue/issueServiceDataType'
import { UploadFilled } from '@element-plus/icons-vue'
const showTip = ref<boolean>(false)
const mark_select = ref()
const content = ref('')
const fileList = ref<UploadFile[]>([])
enum SelectType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  QUESTION = 'QUESTION',
  OTHER = 'OTHER'
}
interface SelectOps {
  name: string,
  value: SelectType
}
const typeSelect = ref<SelectType>('BUG')
const getType = computed(() => {
  switch (typeSelect.value) {
    case 'BUG':
      return 'danger'
    case 'FEATURE':
      return 'success'
    case 'QUESTION':
      return 'warning'
    default:
      return 'info'
  }
})
const selectOpts = ref<SelectOps[]>([
  {
    name: 'BUG',
    value: SelectType.BUG
  },
  {
    name: '功能',
    value: SelectType.FEATURE
  },
  {
    name: '问题',
    value: SelectType.QUESTION
  },
  {
    name: 'other',
    value: SelectType.OTHER
  }
])
const upImgDia = ref({
  show: false
})
const imgList = ref([])
const onHttpRequest = async (file:never) => {
}
const editMarkDia = ref({
  show: false
})
const editingText = ref('')


const onSureMarkdownDia = () => {
  editMarkDia.value = false
}

const readImg = (files:File[]) => {
  files.forEach(item => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      imgList.value.push(e.target?.result)
    }
    fileReader.readAsDataURL(item.raw)
  })
}

const onSureImg = () => {
  upImgDia.value = false
  if (fileList.value && fileList.value.length) {
    readImg(fileList.value)
  }
}


const onEditMarkdown = (val:string) => {
  editingText.value = val
}

const onClearImgByIndex = (index:number) => {
  imgList.value.splice(index, 1)
  fileList.value.splice(index, 1)
}

/**
 * 发送 issue
 */
const onSendIssue = async () => {
  if (!content.value) {
    ElMessage.warning('输入内容为空！')
  }
  const formD = new FormData() as IssueAddItem
  formD.append('markdownStr', editingText.value)
  formD.append('issueType', typeSelect.value)
  formD.append('content', content.value)
  if (fileList.value.length) {
    fileList.value.forEach(item => {
      formD.append('imgs', item.raw)
    })
  }

  const status = await useIssueAddService(formD)
  if (status) {
    editingText.value = ''
    typeSelect.value = SelectType.BUG
    content.value = ''
    fileList.value = []
  }
}

</script>

<template>
  <div w-full>
    <section class="top_menu_bar" flex>
      <el-tooltip content="编写markdown" effect="light" placement="bottom">
        <MaterialSymbolsLightMarkdownPaste
          @click="editMarkDia.show=true"
          cursor-pointer class="hover-color-amber" />
      </el-tooltip>

      <el-tooltip content="上传佐证" effect="light" placement="bottom">
        <MageImage cursor-pointer class="hover-color-amber"
                   @click="upImgDia.show=true"
        />
      </el-tooltip>

      <el-tooltip content="作者提示" effect="light" placement="bottom" >
        <MageNotificationBellPending
          @click="showTip=!showTip"
          cursor-pointer
          class="hover-color-amber" />
      </el-tooltip>

      <el-tooltip
        content="标记类型" effect="light" placement="bottom"
      >
        <MaterialSymbolsLightBookmarkAddOutline
          ref="mark_select"
          cursor-pointer
          class="hover-color-amber"
        />

      </el-tooltip>

      <div class="tag">
        <el-tag :type="getType">
          {{ typeSelect }}
        </el-tag>
      </div>

      <el-popover
        virtual-triggering
        :virtual-ref="mark_select"
        trigger="click"
      >
        <el-select
          placeholder="问题类型"
          v-model="typeSelect"
        >
          <template
            :key="index"
            v-for="(item, index) in selectOpts">
            <el-option
              :label="item.name"
              :value="item.value"
            />
          </template>
        </el-select>

      </el-popover>


    </section>
    <section flex flex-wrap>
      <el-input
        v-model="content"
        :rows="5"
        resize="none"
        type="textarea"
      ></el-input>
      <section flex justify-end w-full="">
        <div @click="onSendIssue" class="btn_style">发布</div>
      </section>
    </section>

    <ImageList
      @clear-img-by-index="onClearImgByIndex"
      :img-list="imgList"
    />

    <AuthorTip v-if="showTip"/>

    <UserComments />

    <TranDiaglog
      title="编辑markdown"
      v-model:pop-control="editMarkDia"
    >
      <div w-full h-122>
        <monaco-editor
          @mardown-is-editing="onEditMarkdown"
          ref="monoEditorRef"
          :isNeedDefaultLang="false"
        ></monaco-editor>
        <!--      <MarkdownMsg v-model:value="editingText" />-->
      </div>

      <div class="btn_group" mt-2>
        <el-button
          size="small"
          type="primary" @click="onSureMarkdownDia">确定</el-button>
      </div>
    </TranDiaglog>

    <TranDiaglog
      title="上传佐证"
      v-model:pop-control="upImgDia"
    >
      <el-upload
        w-full
        class="upload-demo"
        drag
        v-model:file-list="fileList"
        :http-request="onHttpRequest"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽 或者 <em>点击上传</em></div>
      </el-upload>

      <div class="btn_group">
        <el-button size="small"
                   @click="onSureImg"
                   type="primary">确定</el-button>
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

.btn_group {
  @apply flex justify-end w-full;
}

.tag {
  position: relative;
  top: -4px;
}

</style>
