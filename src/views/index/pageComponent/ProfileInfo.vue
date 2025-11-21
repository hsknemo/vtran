<script setup lang="ts">
import { reactive, ref } from 'vue'
import TranDiaglog from '@/components/TranDiaglog.vue'
import { ElMessage, type UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { updateUserProfile } from '@/api/user/user.ts'
import { useLocalStorage } from '@vueuse/core'
const emit = defineEmits(['refresh-user-info'])
const props = defineProps({
  userInfo: {
    type: Object
  }
})
const profile = ref({
  userImg: props.userInfo.userImg,
})
const profileLoading = ref(false)
const blobData = reactive({
  blobImg: null,
  desc: props.userInfo.desc,
})
const uploadImg = ref('')
const imgPop = ref({
  show: false,
})
const fileList: Array<UploadUserFile> = ref([])


const onClickUploadImg = () => {
  imgPop.value.show = true
}

const onRequest = (option: UploadRequestOptions) => {
  const fileReader = new FileReader()
  const size = option.file.size

  if (size > 1024 * 1024 * 6) {
    fileList.value = []
    return ElMessage.error('图片过大')
  }

  fileReader.readAsDataURL(option.file)
  fileReader.onload = (e) => {
    uploadImg.value = e.target.result as string
    fileList.value = []
  }
}

const cropper = ref()

const onCrop = async () => {
  if (uploadImg.value) {
    cropper.value.getCropBlob((data) => {
      blobData.blobImg = data
      window._blobUrl = URL.createObjectURL(data)
      profile.value.userImg = window._blobUrl
      imgPop.value.show = false
    })
  }
}



/**
 * 保存用户信息
 */
const onSaveProFile = async () => {
  try {
    profileLoading.value = true
    const formData: FormData = new FormData()
    if (blobData.blobImg) {
      formData.append('blobImg', blobData.blobImg)
    }
    if (blobData.desc) {
      formData.append('desc', blobData.desc)
    }
    await updateUserProfile(formData)
    ElMessage.success('保存成功')
    emit('refresh-user-info', true)
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    if (window._blobUrl) {
      URL.revokeObjectURL(window._blobUrl)
    }
    profileLoading.value = false
  }
}
</script>

<template>
  <div class="tran_profile_info" v-loading="profileLoading">
    <div class="tran_profile_info_wrap">
      <div class="l">头像</div>
      <div class="r" cursor-pointer @click="onClickUploadImg">
        <el-image :src="profile.userImg" class="img_wrap"></el-image>
      </div>
    </div>
    <div class="tran_profile_info_wrap">
      <div class="l">用户名</div>
      <div class="r">{{ userInfo.username }}</div>
    </div>

    <div class="tran_profile_info_wrap">
      <div class="l">加入时间</div>
      <div class="r">{{ userInfo.insertTime }}</div>
    </div>

    <div class="tran_profile_info_wrap">
      <div class="l">个性签名</div>
      <div class="r" w-full>
        <el-input
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          resize="none"
          v-model="blobData.desc"
          placeholder="请输入内容"
        />
      </div>
    </div>
    <div class="tran_profile_info_wrap" justify-center>
      <el-button size="small" @click="onSaveProFile">修改</el-button>
    </div>
  </div>
  <TranDiaglog title="头像上传" v-model:pop-control="imgPop">
    <el-upload accept="image/*" v-model:file-list="fileList" :http-request="onRequest" :limit="1">
      <el-button size="small">上传图片</el-button>
    </el-upload>

    <div class="upload_viewer">
      <vueCropper
        ref="cropper"
        :img="uploadImg"
        :outputSize="1"
        outputType="png"
        :autoCrop="true"
      ></vueCropper>
    </div>

    <footer class="upload_footer">
      <el-button size="small" @click="onCrop"> 确定 </el-button>
    </footer>
  </TranDiaglog>
</template>

<style scoped lang="scss">
@mixin flexStyle($align: 'center', $justContent: 'space-around') {
  display: flex;
  align-items: $align;
  justify-content: $justContent;
}
@mixin info {
  .tran_profile_info_wrap {
    padding: 10px;
    @include flexStyle();
    .l {
      white-space: nowrap;
      margin-right: 10px;
    }

    .img_wrap {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      border: 1px solid #696d69;
    }
  }
}
.tran_profile_info {
  max-height: 400px;
  overflow: auto;
  background-color: #1d1d1d;
  border-radius: 5px;
  position: relative;
  &:before {
    content: 'TranUser';
    color: #3c3b3b;
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    user-select: none;
    letter-spacing: 4px;
    font-style: italic;
  }

  @include info();
}

.upload_viewer {
  width: 200px;
  height: 200px;
}

.upload_footer {
  margin-top: 10px;
}
</style>
